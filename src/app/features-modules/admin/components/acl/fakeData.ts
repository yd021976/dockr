// TODO: implement data loading from server
export const TREE_DATA = JSON.stringify({
    "templates": [
      {
        "admin": [
          { create: true },
          { delete: true },
          {
            update: [
              {
                id: true,
                name: true
              }
            ]
          },
          {
            read: [
              {
                id: true,
                name: true
              }
            ]
          }
        ]
      }
    ]
  })

  export const EXAMPLE = JSON.stringify({
    Applications: {
      Calendar: 'app',
      Chrome: 'app',
      Webstorm: 'app'
    },
    Documents: {
      angular: {
        src: {
          compiler: 'ts',
          core: 'ts'
        }
      },
      material2: {
        src: {
          button: 'ts',
          checkbox: 'ts',
          input: 'ts'
        }
      }
    },
    Downloads: {
      October: 'pdf',
      November: 'pdf',
      Tutorial: 'html'
    },
    Pictures: {
      'Photo Booth Library': {
        Contents: 'dir',
        Pictures: 'dir'
      },
      Sun: 'png',
      Woods: 'jpg'
    },
    Pictures2: {
      'Photo Booth Library': {
        Contents: 'dir',
        Pictures: 'dir'
      },
      Sun: 'png',
      Woods: 'jpg'
    },
    Pictures3: {
      'Photo Booth Library': {
        Contents: 'dir',
        Pictures: 'dir'
      },
      Sun: 'png',
      Woods: 'jpg'
    }
    ,
    Pictures4: {
      'Photo Booth Library': {
        Contents: 'dir',
        Pictures: 'dir'
      },
      Sun: 'png',
      Woods: 'jpg'
    }
    ,
    Pictures5: {
      'Photo Booth Library': {
        Contents: 'dir',
        Pictures: 'dir'
      },
      Sun: 'png',
      Woods: 'jpg'
    }
    ,
    Pictures6: {
      'Photo Booth Library': {
        Contents: 'dir',
        Pictures: 'dir'
      },
      Sun: 'png',
      Woods: 'jpg'
    }
    ,
    Pictures7: {
      'Photo Booth Library': {
        Contents: 'dir',
        Pictures: 'dir'
      },
      Sun: 'png',
      Woods: 'jpg'
    }
    ,
    Pictures8: {
      'Photo Booth Library': {
        Contents: 'dir',
        Pictures: 'dir'
      },
      Sun: 'png',
      Woods: 'jpg'
    }
  })