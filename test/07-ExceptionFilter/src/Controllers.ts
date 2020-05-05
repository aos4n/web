import { Controller, Mapping, UseExceptionFilter } from '../../../bin';
import { MyException, MyException1, MyException3 } from '../Exceptions';
import {
    MyExceptionFilter1, MyExceptionFilter2, MyExceptionFilter3, MyExceptionFilter4,
    MyExceptionFilter6, MyExceptionFilter7
} from './ExceptionFilters';

@Controller()
@UseExceptionFilter(MyExceptionFilter1)
@UseExceptionFilter(MyExceptionFilter2)
export class Home1Controller {
    @UseExceptionFilter(MyExceptionFilter3)
    @UseExceptionFilter(MyExceptionFilter4)
    @Mapping()
    index() {
        throw new Error('err')
    }
}

@Controller()
@UseExceptionFilter(MyExceptionFilter6)
export class Home2Controller {
    @Mapping()
    index() {
        throw new MyException('err')
    }

    @Mapping()
    index1() {
        throw new MyException1('err')
    }
}

@Controller()
@UseExceptionFilter(MyExceptionFilter7)
export class Home3Controller {
    @Mapping()
    index() {
        throw new MyException3('err')
    }
}