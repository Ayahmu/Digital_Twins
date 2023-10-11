export default {
    methods: {
      getViewportWidth() {
        return window.innerWidth || document.documentElement.clientWidth;
      },
  
      calculateLabelSize() {
        var viewportWidth = this.getViewportWidth();
        var labelSize = viewportWidth * 0.01; // 假设为视口宽度的1%
        return labelSize;
      }
    }
  }