
import {
    BindBody, BindContext, BindHeader, BindPath, BindPaths, BindQuery, BindQuerys, BindRequest,
    BindResponse, Context, Controller, GetMapping, Mapping, PostMapping, Request, Response
} from '../../../bin';
import { Index5IM, Index7IM, Index9IM } from './Models';

@Controller()
export class HomeController {
    @Mapping()
    index1(@BindContext ctx: Context) {
        ctx.body = 'ok'
    }

    @Mapping()
    index2(@BindRequest req: Request) {
        return req.query.name
    }

    @Mapping()
    index3(@BindResponse res: Response) {
        return res.body = 'ok'
    }

    @Mapping()
    index4(@BindQuery('name') name: string) {
        return name
    }

    @Mapping()
    index5(@BindQuerys im: Index5IM) {
        return im
    }

    @GetMapping('/i6/:name')
    index6(@BindPath('name') name: string) {
        return name
    }

    @GetMapping('/i7/:school/:grade')
    index7(@BindPaths im: Index7IM) {
        return im
    }

    @Mapping()
    index8(@BindHeader('ticket') ticket: string) {
        return ticket
    }

    @PostMapping()
    index9(@BindBody im: Index9IM) {
        return im
    }
}