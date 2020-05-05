import { Controller, Mapping } from '../../../bin';

@Controller()
export class Home1Controller {

}

@Controller()
export class Home2Controller {
    @Mapping()
    index() {
        return 'ok'
    }
}

@Controller('/h3')
export class Home3Controller {
    @Mapping()
    index() {
        return 'ok'
    }
}