import { ExceptionFilter, ExceptionHandler, GlobalExceptionFilter } from '../../../bin';
import { MyException, MyException2 } from '../Exceptions';

@ExceptionFilter
export class MyExceptionFilter1 {
    @ExceptionHandler(Error)
    async handleError(ctx: any, error: Error) {
        ctx.body = 'MyExceptionFilter1'
    }
}

@ExceptionFilter
export class MyExceptionFilter2 {
    @ExceptionHandler(Error)
    async handleError(ctx: any, error: Error) {
        ctx.body = 'MyExceptionFilter2'
    }
}

@ExceptionFilter
export class MyExceptionFilter3 {
    @ExceptionHandler(Error)
    async handleError(ctx: any, error: Error) {
        ctx.body = 'MyExceptionFilter3'
    }
}

@ExceptionFilter
export class MyExceptionFilter4 {
    @ExceptionHandler(Error)
    async handleError(ctx: any, error: Error) {
        ctx.body = 'MyExceptionFilter4'
    }
}

@GlobalExceptionFilter({ match: /^\/home1/i })
export class MyGlobalExceptionFilter5 {
    @ExceptionHandler(Error)
    async handleError(ctx: any, error: Error) {
        ctx.body = 'MyGlobalExceptionFilter5'
    }
}

@ExceptionFilter
export class MyExceptionFilter6 {
    @ExceptionHandler(MyException)
    async handleMyException(ctx: any, ex: MyException) {
        ctx.body = 'MyExceptionFilter6_MyException'
    }

    @ExceptionHandler(Error)
    async handleError(ctx: any, error: Error) {
        ctx.body = 'MyExceptionFilter6_Error'
    }
}

@ExceptionFilter
export class MyExceptionFilter7 {
    @ExceptionHandler(MyException2)
    async handleMyException2(ctx: any, ex: MyException) {
        ctx.body = 'MyExceptionFilter7'
    }
}