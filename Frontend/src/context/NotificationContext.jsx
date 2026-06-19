import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { getParcelsOfCustomer, getParcelLog } from '../api/endpoints'

const NotificationContext = createContext(null)

const STATUS_LABEL = {
  WAITING: 'booked',
  PICKED_UP: 'picked up',
  IN_TRANSIT: 'in transit',
  AT_WAREHOUSE: 'at the warehouse',
  OUT_FOR_DELIVERY: 'out for delivery',
  DELIVERED: 'delivered',
  FAILED_DELIVERY: 'delivery failed',
}

const POLL_INTERVAL_MS = 15000

function storageKey(userId) {
  return `parcello_known_status_${userId}`
}
function notifKey(userId) {
  return `parcello_notifications_${userId}`
}

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [toasts, setToasts] = useState([])
  const knownStatusRef = useRef({})
  const userIdRef = useRef(null)

  useEffect(() => {
    const userId = user?._id || user?.id
    userIdRef.current = userId || null
    if (!userId) {
      setNotifications([])
      knownStatusRef.current = {}
      return
    }
    try {
      knownStatusRef.current = JSON.parse(localStorage.getItem(storageKey(userId)) || '{}')
    } catch {
      knownStatusRef.current = {}
    }
    try {
      setNotifications(JSON.parse(localStorage.getItem(notifKey(userId)) || '[]'))
    } catch {
      setNotifications([])
    }
  }, [user])

  const pushToast = useCallback((notification) => {
    setToasts((t) => [...t, notification])
    setTimeout(() => {
      setToasts((t) => t.filter((n) => n.id !== notification.id))
    }, 5000)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((n) => n.id !== id))
  }, [])

  const poll = useCallback(async () => {
    const userId = userIdRef.current
    if (!userId || user?.accountType !== 'Customer') return

    try {
      const { data: parcels } = await getParcelsOfCustomer(userId)
      const results = await Promise.allSettled(parcels.map((p) => getParcelLog(p._id)))
      const newNotifications = []

      results.forEach((res, i) => {
        if (res.status !== 'fulfilled') return
        const log = res.value.data
        const parcel = parcels[i]
        const prevStatus = knownStatusRef.current[parcel._id]
        const newStatus = log.status

        if (prevStatus === undefined) {
          knownStatusRef.current[parcel._id] = newStatus
          return
        }
        if (prevStatus !== newStatus) {
          knownStatusRef.current[parcel._id] = newStatus
          const label = STATUS_LABEL[newStatus] || newStatus.toLowerCase()
          const notification = {
            id: `${parcel._id}-${newStatus}-${Date.now()}`,
            parcelId: parcel._id,
            status: newStatus,
            text: `Your ${parcel.type || 'parcel'} to ${parcel.destination?.city || 'destination'} is now ${label}.`,
            time: new Date().toISOString(),
            read: false,
          }
          newNotifications.push(notification)
        }
      })

      if (newNotifications.length > 0) {
        setNotifications((prev) => {
          const updated = [...newNotifications, ...prev].slice(0, 30)
          localStorage.setItem(notifKey(userId), JSON.stringify(updated))
          return updated
        })
        newNotifications.forEach(pushToast)
      }
      localStorage.setItem(storageKey(userId), JSON.stringify(knownStatusRef.current))
    } catch {
      // silent — next poll retries
    }
  }, [user, pushToast])

  useEffect(() => {
    if (!user || user.accountType !== 'Customer') return
    poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [user, poll])

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    const userId = userIdRef.current
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }))
      if (userId) localStorage.setItem(notifKey(userId), JSON.stringify(updated))
      return updated
    })
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, toasts, dismissToast }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
