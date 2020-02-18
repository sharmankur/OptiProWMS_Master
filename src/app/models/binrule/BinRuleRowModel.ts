export class BinRuleRowModel{
    public OPTM_WHS_RULE: string;
    public OPTM_STORAGE_FROM_BIN: string;
    public OPTM_STORAGE_TO_BIN: string;
    public OPTM_PUTWAY_STAGE_BIN: string;
    public OPTM_PICK_DROP_BIN: string;
    public OPTM_LINEID: any;

    constructor(OPTM_WHS_RULE:string, OPTM_STORAGE_FROM_BIN: string, OPTM_STORAGE_TO_BIN: string,
        OPTM_PUTWAY_STAGE_BIN:string,){
        this.OPTM_WHS_RULE = OPTM_WHS_RULE;
        this.OPTM_STORAGE_FROM_BIN = OPTM_STORAGE_FROM_BIN;
        this.OPTM_STORAGE_TO_BIN = OPTM_STORAGE_TO_BIN;
        this.OPTM_PUTWAY_STAGE_BIN = OPTM_PUTWAY_STAGE_BIN;
        this.OPTM_PICK_DROP_BIN = ''
        this.OPTM_LINEID  = ''
    }
}