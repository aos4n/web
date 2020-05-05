
import {
    BindBody, BindQuery, Controller, Decimal, Length, Mapping, Max, MaxDecimal, MaxLength, Min,
    MinDecimal, MinLength, NotEmpty, NotNull, PostMapping, Range, Reg
} from '../../../bin';
import { Index1IM } from './Models';
import { MyValidator } from './MyValidator';

@Controller()
export class HomeController {
    @PostMapping()
    index1(@BindBody im: Index1IM) {
        return 'ok'
    }

    @Mapping()
    index2(@BindQuery('id') @NotNull() id: number) {
        return 'ok'
    }

    @Mapping()
    index3(@BindQuery('id') @NotNull() id: number) {
        return 'ok'
    }

    @Mapping()
    index4(@BindQuery('name') @NotEmpty() name: string) {
        return 'ok'
    }

    @Mapping()
    index5(@BindQuery('name') @Length(2, 2) name: string) {
        return 'ok'
    }

    @Mapping()
    index6(@BindQuery('name') @MinLength(2) name: string) {
        return 'ok'
    }

    @Mapping()
    index7(@BindQuery('name') @MaxLength(2) name: string) {
        return 'ok'
    }

    @Mapping()
    index8(@BindQuery('id') @Range(2, 2) id: number) {
        return 'ok'
    }

    @Mapping()
    index9(@BindQuery('id') @Min(2) id: number) {
        return 'ok'
    }

    @Mapping()
    index10(@BindQuery('id') @Max(2) id: number) {
        return 'ok'
    }

    @Mapping()
    index11(@BindQuery('id') @Decimal(2, 2) id: number) {
        return 'ok'
    }

    @Mapping()
    index12(@BindQuery('id') @MinDecimal(2) id: number) {
        return 'ok'
    }

    @Mapping()
    index13(@BindQuery('id') @MaxDecimal(2) id: number) {
        return 'ok'
    }

    @Mapping()
    index14(@BindQuery('name') @Reg(/^[a-z]+$/) name: string) {
        return 'ok'
    }

    @Mapping()
    index15(@BindQuery('name') @MyValidator() name: string) {
        return 'ok'
    }
}