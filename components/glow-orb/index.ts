Component({
  properties: {
    size: {
      type: Number,
      value: 100
    },
    label: {
      type: String,
      value: ''
    },
    hint: {
      type: String,
      value: ''
    },
    accentA: {
      type: String,
      value: '#f4e8a0'
    },
    accentB: {
      type: String,
      value: '#f1b7b1'
    },
    accentC: {
      type: String,
      value: '#b8cfff'
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent('orbpress')
    }
  }
})
