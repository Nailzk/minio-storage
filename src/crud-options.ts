import { CrudConfigService } from "@nestjsx/crud";

CrudConfigService.load({
    query: {
        alwaysPaginate: true,
    },
});