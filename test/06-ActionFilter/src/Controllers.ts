
import { BindContext, Context, Controller, GetMapping, UseActionFilter } from '../../../bin';
import {
    MyActionFilter1, MyActionFilter2, MyActionFilter3, MyActionFilter4
} from './ActionFilters';
import { MyActionFilter5 } from './MyActionFilter5';
import { MyActionFilter6 } from './MyActionFilter6';

@UseActionFilter(MyActionFilter1)
@UseActionFilter(MyActionFilter2)
@Controller()
export class HomeController {
    @UseActionFilter(MyActionFilter3)
    @UseActionFilter(MyActionFilter4)
    @GetMapping()
    index(@BindContext ctx: Context) {
        return 'ok'
    }
}

@Controller()
export class Home1Controller {
    n: number = 1
    @UseActionFilter(MyActionFilter6)
    @UseActionFilter(MyActionFilter5)
    @GetMapping()
    index() {
        this.n = 2
        return 'ok'
    }
}

@Controller()
export class Home2Controller {
    @GetMapping()
    index(@BindContext ctx: Context) {
        return ctx.state.str || 'null'
    }
}

@Controller()
export class Home3Controller {
    @GetMapping()
    index(@BindContext ctx: Context) {
        return ctx.state.str || 'null'
    }
}