export class Shipment {
    constructor() { }
    HeaderTableBindingData: HeaderTableBindingData[];
    OtherItemsDTL: OtherItemsDTL[];
}

export class HeaderTableBindingData {
    OPTM_CONTAINERID: string;
    OPTM_CONTTYPE: string;
    OPTM_CONTCODE: string;
    OPTM_WEIGHT: any;
    OPTM_AUTOCLOSE_ONFULL: any;
    OPTM_AUTORULEID: number;
    OPTM_WHSE: string;
    OPTM_BIN: string;
    OPTM_CREATEDBY: string;
    OPTM_MODIFIEDBY: string;
    Length: any;
    Width: any;
    Height: number;
    ContainerWeight: string;
    ItemCode: string;
    NoOfPacks: string;
    OPTM_TASKID: string;
    CompanyDBId: any;
    Username: any;
    UserId: any;
    GUID: any;
    Action: string;
    OPTM_PARENTCODE: string;
    OPTM_GROUP_CODE: any;
    CreateMode: any;
}

export class OtherItemsDTL {
    OPTM_ItemCode: string;
    OPTM_QUANTITY: number;
    OPTM_CONTAINER: string;
    OPTM_AVLQUANTITY: number;
    OPTM_INVQUANTITY: number;
    OPTM_BIN: string;
}