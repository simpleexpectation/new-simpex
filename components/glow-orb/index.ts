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
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent('orbpress')
    }
  }
})
