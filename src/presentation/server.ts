import express, { Router } from 'express';
import path from 'path';

interface Options {
    port: number;
    routes: Router;
    public_path?: string;
}

export class Server {

    private app = express();
    private readonly port: number;
    private readonly publicPath: string;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, routes,public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
    }

    async start() {

        //* Middlewares
        // Parsea la info que viene en el body y la transforma en objecto JSON:
        this.app.use( express.json() );
        // El sig middle permite el x-www-form-urlencoded
        this.app.use( express.urlencoded({ extended: true }) );

        //* Public Folder
        this.app.use( express.static(this.publicPath) );

        //* Routes
        this.app.use( this.routes );

        this.app.get('*', (req, res) => {
            const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
            res.sendFile(indexPath);
            return;
        });

        this.app.listen(this.port, () => {
            console.log(`Server running on port ${ this.port }`);
        });

    }

}



