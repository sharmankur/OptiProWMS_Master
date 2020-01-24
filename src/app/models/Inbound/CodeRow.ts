export class CodeRow {

    public rowindex: number;
    public stringtype: number;
    public string: string;
    public length: number;
    public operations: number;
    public delete: string;
    public CompanyDBId: string;
    public codekey: string;
    public CreatedUser: string;
    public isOperationDisable: boolean;
    public GUID: string;
    public UsernameForLic: string;

    constructor(rowindex: number, stringtype: any, string: string, length: number, operations: any, 
        isDelete: string, company: string, createdUser: string, codekey: string, 
        isOperationDisable: boolean, guid: string, usernameforlic: string){
    
    this.rowindex = rowindex
    if(stringtype == undefined || stringtype == null || stringtype == ""){
        stringtype = "0";
    }
    if(operations == undefined || operations == null || operations == ""){
        operations = "0";
    }
    this.stringtype = Number(stringtype);
    this.string = string;
    this.length = length;
    this.operations = Number(operations);
    this.delete = isDelete;
    this.CompanyDBId = company;
    this.codekey = codekey;
    this.CreatedUser = createdUser;
    this.isOperationDisable = isOperationDisable;
    this.GUID = guid;
    this.UsernameForLic = usernameforlic;
}
}