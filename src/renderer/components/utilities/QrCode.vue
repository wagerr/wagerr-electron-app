<template>
  <canvas id="qr-code" :value="value"></canvas>
</template>

<script>
import QRCode from 'qrcode';
import ipcRenderer from '../../../common/ipc/ipcRenderer';

export default {
  name: 'QrCode',

  props: {
    value: {
      type: String,
      required: true
    },
    width: {
      type: [Number, String],
      default: 100,
      validator: s => isNaN(Number(s)) !== true
    }
  },

  methods: {
    renderQrCode() {
      let canvas = document.getElementById('qr-code');

      QRCode.toCanvas(
        canvas,
        this.value,
        { errorCorrectionLevel: 'H', margin: '0', width: this.width },
        function(error) {
          if (error) ipcRenderer.log('debug', error);
        }
      );
    }
  },

  updated: function() {
    this.renderQrCode();
  }
};
</script>
