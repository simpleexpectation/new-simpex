const { officialEvents, venues } = require('../../data/mock')

function fmtKey(date) {
  return String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0')
}

function getEventDateKeys() {
  return officialEvents.map(function (e) { return e.dateKey }).filter(Boolean)
}

function buildWeekDates(today, eventDateKeys) {
  var WEEK_NAMES = ['一', '二', '三', '四', '五', '六', '日']
  var day = today.getDay()
  var monday = new Date(today)
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
  monday.setHours(0, 0, 0, 0)
  var todayKey = fmtKey(today)

  return Array.from({ length: 7 }, function (_, i) {
    var d = new Date(monday)
    d.setDate(monday.getDate() + i)
    var key = fmtKey(d)
    return {
      week: WEEK_NAMES[i],
      day: d.getDate(),
      key: key,
      active: key === todayKey,
      warm: key !== todayKey && eventDateKeys.indexOf(key) !== -1,
      hasEvent: eventDateKeys.indexOf(key) !== -1
    }
  })
}

function buildMonthCalendar(today, eventDateKeys) {
  var WEEK_NAMES = ['一', '二', '三', '四', '五', '六', '日']
  var year = today.getFullYear()
  var month = today.getMonth()
  var todayKey = fmtKey(today)

  var firstDay = new Date(year, month, 1)
  var lastDayNum = new Date(year, month + 1, 0).getDate()
  var firstDow = firstDay.getDay()
  var leadingEmpty = firstDow === 0 ? 6 : firstDow - 1

  var weeks = []
  var row = []

  for (var i = 0; i < leadingEmpty; i++) {
    row.push({ empty: true, key: 'e' + i })
  }

  for (var d = 1; d <= lastDayNum; d++) {
    var mm = String(month + 1).padStart(2, '0')
    var dd = String(d).padStart(2, '0')
    var key = mm + '-' + dd
    row.push({
      empty: false,
      day: d,
      key: key,
      active: key === todayKey,
      warm: key !== todayKey && eventDateKeys.indexOf(key) !== -1,
      hasEvent: eventDateKeys.indexOf(key) !== -1
    })
    if (row.length === 7) {
      weeks.push(row.slice())
      row = []
    }
  }

  if (row.length > 0) {
    while (row.length < 7) row.push({ empty: true, key: 'et' + row.length })
    weeks.push(row)
  }

  return {
    header: WEEK_NAMES,
    weeks: weeks,
    monthLabel: year + ' 年 ' + (month + 1) + ' 月'
  }
}

Page({
  data: {
    officialEvents,
    venues,
    weekDates: [],
    monthCalendar: { header: [], weeks: [], monthLabel: '' },
    calendarExpanded: false,
    pageReady: false,
    pageLeaving: false
  },
  onLoad() {
    var today = new Date()
    var eventDateKeys = getEventDateKeys()
    this.setData({
      weekDates: buildWeekDates(today, eventDateKeys),
      monthCalendar: buildMonthCalendar(today, eventDateKeys)
    })
  },
  onShow() {
    this.showTabBar()
    this.enterPage()
  },
  enterPage() {
    this.setData({ pageLeaving: false, pageReady: false })
    setTimeout(() => {
      this.setData({ pageReady: true })
    }, 20)
  },
  showTabBar() {
    var tabBar = this.getTabBar && this.getTabBar()
    if (tabBar && tabBar.sync) {
      tabBar.sync('/pages/discovery/index', false)
    }
  },
  toggleCalendar() {
    this.setData({ calendarExpanded: !this.data.calendarExpanded })
  },
  onCalendarTouchStart(e) {
    this._touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  },
  onCalendarTouchEnd(e) {
    if (!this._touchStart) return
    var dx = Math.abs(e.changedTouches[0].clientX - this._touchStart.x)
    var dy = e.changedTouches[0].clientY - this._touchStart.y
    if (dx < 30 && dy > 50 && !this.data.calendarExpanded) {
      this.setData({ calendarExpanded: true })
    } else if (dx < 30 && dy < -50 && this.data.calendarExpanded) {
      this.setData({ calendarExpanded: false })
    }
    this._touchStart = null
  },
  goEventDetail(e) {
    var id = (e && e.currentTarget && e.currentTarget.dataset) ? e.currentTarget.dataset.id : null
    this.setData({ pageLeaving: true })
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/event-detail/index?id=' + (id || 'event-night-0322') })
    }, 180)
  }
})
