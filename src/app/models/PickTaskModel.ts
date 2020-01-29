export class PickTaskModel {

    public OPTM_ShipId: string;
    public OPTM_PickTaskId: string;
    public OPTM_Whs: string;
    public OPTM_Location: string;
    public OPTM_ContBtchSer: string;
    public OPTM_Qty: number;

    constructor(OPTM_ShipId: string, OPTM_PickTaskId: string, OPTM_Whs: string, OPTM_Location: string, OPTM_ContBtchSer: string, OPTM_Qty: number
    ) {
        this.OPTM_ShipId = OPTM_ShipId;
        this.OPTM_PickTaskId = OPTM_PickTaskId;
        this.OPTM_Whs = OPTM_Whs;
        this.OPTM_Location = OPTM_Location;
        this.OPTM_ContBtchSer = OPTM_ContBtchSer;
        this.OPTM_Qty = OPTM_Qty;
    }
}