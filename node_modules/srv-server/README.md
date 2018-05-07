# srv-server
## Server functionality for server blueprint

- Class `HTTPServer` starts/stops HTTP server with parameters specified in configuration.
- Class `HTTPSServer` starts/stops HTTPS server with parameters specified in configuration.
- Class `Router` creates [Express](https://expressjs.com/) router as specified in configuration.
- Class `router.Session` binds session middle-ware to router
- Class `router.Static` binds static pages/files middle-ware to router
- Class `router.RequestLog` binds logging middle-ware to router (uses [bunyan-middleware](https://github.com/tellnes/bunyan-middleware))
- Class `router.ServerError` binds error page serving middle-ware to router
- Class `router.Upload` binds file upload middle-ware to router
- Class `router.Form` binds POST form parsing middle-ware to router
- Class `router.JSON` binds JSON body parsing middle-ware to router
- Class `router.XML` binds XML body parsing middle-ware to router
