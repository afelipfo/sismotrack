import { createApp } from '../server/_core/index';

export default async function handler(req: any, res: any) {
    const { app } = await createApp();
    app(req, res);
}
