![logo](https://camo.githubusercontent.com/2d9d38ec6470a2efffe540b5ad2cdd13f83978ac/68747470733a2f2f756e706b672e636f6d2f61746f6d69636f2f646f63732f6272616e642f6c6f676f2d626c61636b2e737667)

### Starter kit result

```showcase
  <my-counter></my-counter>
```

### Links

- [Official website (github.com)](https://github.com/atomicojs/atomico)
- [Docs](https://github.com/atomicojs/atomico#installation)
- [GitHub](https://github.com/atomicojs/atomico)
- [Issues](https://github.com/atomicojs/atomico/issues)
- Author : [UpperCod](https://twitter.com/UpperCod)

## Important aspects

### Tag `host`.

This allows you to control the WC status, if you want to enable shadowDom.
simply declare `<host shadowDom>`, likewise if you want to listen to a click event on the WC you can use `<host onclick=${handler}>`.

**All WC created with Atomico, should always return the host tag**
