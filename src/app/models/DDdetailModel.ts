export class DDdetailModel{
    
    public OPTM_LINEID: string;
    public OPTM_SHIP_STAGEBIN: string;
    public OPTM_DEFAULT: string;
    public OPTM_DEFAULT_BOOL: boolean;

    constructor(OPTM_LINEID: string, OPTM_SHIP_STAGEBIN: string, OPTM_DEFAULT:string){
        this.OPTM_LINEID = OPTM_LINEID;
        this.OPTM_SHIP_STAGEBIN = OPTM_SHIP_STAGEBIN;
        this.OPTM_DEFAULT = OPTM_DEFAULT;
        this.OPTM_DEFAULT_BOOL = this.OPTM_DEFAULT == "Y"?true:false;
    }
}