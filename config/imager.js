
/**
 * Expose
 */

module.exports = {
  /*variants: {
    article: {
      // keepNames: true,
      resize: {
        mini : '300x200',
        preview: '800x600'
      },
      crop: {
        thumb: '200x200'
      },
      resizeAndCrop: {
        large: {
          resize: '1000x1000',
          crop: '900x900'
        }
      }
    },

    gallery: {
      crop: {
        thumb: '100x100'
      }
    }
  }*/
  variants: {
    article: {
      resize: {
        detail: 'x440'
      },
      crop: {

      },
      resizeAndCrop: {
        mini: { resize: '63504@', crop: '252x210' }
      }
    },

    gallery: {
      crop: {
        thumb: '100x100'
      }
    }
  },

  storage: {
    S3: {
      key: "AKIAJT7BOR7VPCRRVX4Q",
      secret: "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",
      bucket: "sbikee"
    }
  },
  debug: true
}