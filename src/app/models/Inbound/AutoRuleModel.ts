export class AutoRuleModel{
    
    public OPTM_ITEMCODE: string;
    public OPTM_RULEID: number;
    public OPTM_PARTS_PERCONT: string;
    public OPTM_MIN_FILLPRCNT: string;

    constructor(OPTM_ITEMCODE: string, OPTM_RULEID: number, OPTM_PARTS_PERCONT:string, OPTM_MIN_FILLPRCNT: string
        ){
        this.OPTM_ITEMCODE = OPTM_ITEMCODE;
        this.OPTM_RULEID = OPTM_RULEID;
        this.OPTM_PARTS_PERCONT = OPTM_PARTS_PERCONT;
        this.OPTM_MIN_FILLPRCNT = OPTM_MIN_FILLPRCNT;
    }
}