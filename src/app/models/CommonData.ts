import { HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
// ng build --prod --base-href=/OptiProERPWMS/
//1. ng build --base-href=/OptiProERPShipment/
//2. add OptiProERPWMS in css path in index.html

export interface ColumnSetting {
    field: string;
    title: string;
    format?: string;
    type: 'text' | 'numeric' | 'boolean' | 'date';
    width?: string;
    headerClass?: string;
    class?: string;
}

// Example of Data as model, can be used for non updating data (exaple - names, task type and etc)
export class CommonData {
    public project_name: string = "Optipro Configurator";
    public adminDBName: string = "OPTIPROADMIN";
    public href: any = window.location.href;
    public application_path = this.get_current_url();
    public commonGridPageSize = 10;

    constructor(private translate: TranslateService) {
        let userLang = navigator.language.split('-')[0];
        userLang = /(fr|en)/gi.test(userLang) ? userLang : 'fr';
        translate.use(userLang);
        translate.onLangChange.subscribe(() => {
        });
    }


    public get_current_url() {
        let temp: any = this.href.substring(0, this.href.lastIndexOf('/'));
        if (temp.lastIndexOf('#') != '-1') {
            temp = temp.substring(0, temp.lastIndexOf('#'));
        }
        let sanitized = temp.replace(/^http\:\/\//, '').replace(/\/+/g, '/').replace(/\/+$/, '');
        temp = (window.location.protocol + '//' + sanitized);

        return temp;
    }

    public toast_config = {
        closeButton: true,
        progressBar: false,
        timeOut: 5000,
        positionClass: 'toast-bottom-right',
        iconClasses: {
            error: 'alert alert-danger',
            info: 'alert alert-info ',
            success: 'alert alert-success ',
            warning: 'alert alert-warning'
        }
    };

    //defining properties for the call 
    public httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
    }

    public lookup_selected_value = '';

    public stringtypevalue: any = [
        { "value": 1, "Name": "String" },
        { "value": 2, "Name": "Number" }
    ];

    public opertions: any = [
        { "value": 1, "Name": this.translate.instant("No_Operation")},
        { "value": 2, "Name": this.translate.instant("Increase")},
        { "value": 3, "Name": this.translate.instant("Decrease")}
    ];

    public bom_type: any = [
        { "value": 1, "Name": "Feature" },
        { "value": 2, "Name": "Item" },
        { "value": 3, "Name": "Value" }
    ];

    public less_bom_type: any = [
        { "value": 2, "Name": "Item" }
        /*  , { "value": 3, "Name": "Value" } */
    ];

    public model_bom_type: any = [
        { "value": 1, "Name": "Feature" },
        { "value": 2, "Name": "Item" },
        { "value": 3, "Name": "Model" }
    ];

    public rule_seq_type: any = [
        { "value": '', "Name": "" },
        { "value": 1, "Name": "Feature" },
        { "value": 2, "Name": "Model" }
    ];

    public operator_type: any = [
        { "value": '', "Name": "" },
        { "value": 'or', "Name": "OR" },
        { "value": 'and', "Name": "AND" }
    ];

    public yes_no_option: any = [
        { "value": '', "Name": "" },
        { "value": 'n', "Name": "No" },
        { "value": 'y', "Name": "Yes" }
    ];

    public bracket_list = [
        { "value": '' },
        { "value": "[" },
        { "value": "{", },
        { "value": "(" },
        { "value": "]" },
        { "value": "}", },
        { "value": ")" },
    ];

    public express_conditions = [
        { "value": "=" },
        { "value": "<" },
        { "value": ">" },
        { "value": "<=" },
        { "value": ">=" },
        { "value": "Between" }
        /* , { "value": "In" }, */
    ];

    public document_type = [
        //{ "value": '', "Name": "" },
        { "value": 'draft', "Name": "Draft", "selected": "1" },
        { "value": 'sales_quote', "Name": "Sales Quote", "selected": "0" },
        { "value": 'sales_order', "Name": "Sales Order", "selected": "0" }
    ];


    // for common view
    public default_limits = ["10", "25", "50", "100"];
    public default_count = "10";

    blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return <File>theBlob;
    }

    checkSession() {
        let login_page = this.application_path + '/index.html#login';
        if (sessionStorage.getItem('isLoggedIn') == null) {
            window.location.href = login_page;
        }
    }

    item_code_gen_string_dropdown() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "value": 1, "Name": "String" },
            { "value": 2, "Name": "Number" },
            { "value": 3, "Name": "Parameter" }
        ];
    }

    item_code_gen_oper_drpdown() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "value": 1, "Name": "No Operation" },
            { "value": 2, "Name": "Increase" },
            { "value": 3, "Name": "Decrease" }
        ];
    }

    public excludeSpecialCharRegex = /[{}*!^=<>?|/(\\)&#@%]/;

    container_creation_purpose_string_dropdown() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "Value": 1, "Name": this.translate.instant("Shipping") },
            { "Value": 2, "Name": this.translate.instant("Internal") }
        ];
    }

    container_use_array() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "Value": 1, "Name": this.translate.instant("Shipping") },
            { "Value": 2, "Name": this.translate.instant("Internal") },
            { "Value": 3, "Name": this.translate.instant("Both") }
        ];
    }

    container_creation_create_mode_string_dropdown() {
        // let language = JSON.parse(sessionStorage.getItem('current_lang'));
        return [
            { "Value": 1, "Name": this.translate.instant("Auto_Rule_Based") },
            { "Value": 2, "Name": this.translate.instant("Manual_Rule_Based") },
            { "Value": 3, "Name": this.translate.instant("Manual") }
        ];
    }

    shiment_status_array() {
        return [
            { "Value": 1, "Name": this.translate.instant("CStatusNew") },
            { "Value": 2, "Name": this.translate.instant("CScheduledNew") },
            { "Value": 3, "Name": this.translate.instant("Part_Allocated") },
            { "Value": 4, "Name": this.translate.instant("Allocated") },
            { "Value": 5, "Name": this.translate.instant("Part_Picked") },
            { "Value": 6, "Name": this.translate.instant("Picked") },
            { "Value": 7, "Name": this.translate.instant("Ship_Staged") },
            { "Value": 8, "Name": this.translate.instant("Unstaged") },
            { "Value": 9, "Name": this.translate.instant("Loaded_on_truck") },
            { "Value": 10, "Name": this.translate.instant("CShippedNew") },
            { "Value": 11, "Name": this.translate.instant("Part_Returned") },
            { "Value": 12, "Name": this.translate.instant("Returned") },
            { "Value": 13, "Name": this.translate.instant("Return_Accepted") },
            { "Value": 14, "Name": this.translate.instant("CCancelledNew") },
            { "Value": 15, "Name": this.translate.instant("Loading") },
            { "Value": 16, "Name": this.translate.instant("UnLoaded") }
        ];
    }

    Container_Shipment_Inv_Status_DropDown() {
        return [
            { "Value": 1, "Name": this.translate.instant("InvStatusPending") },
            { "Value": 2, "Name": this.translate.instant("InvStatusPosted") }
        ];
    }

    Container_Shipment_Status_DropDown() {
        return [

            { "Value": 1, "Name": this.translate.instant("CStatusNew") },
            { "Value": 2, "Name": this.translate.instant("Open") },
            { "Value": 3, "Name": this.translate.instant("CClosedNew") },
            { "Value": 4, "Name": this.translate.instant("CReopenedNew") },
            { "Value": 5, "Name": this.translate.instant("CAssignedNew") },
            { "Value": 6, "Name": this.translate.instant("Status_Picked") },
            { "Value": 7, "Name": this.translate.instant("Loaded") },
            { "Value": 8, "Name": this.translate.instant("CShippedNew") },
            { "Value": 9, "Name": this.translate.instant("Returned") },
            { "Value": 10, "Name": this.translate.instant("CDamagedNew") },
            { "Value": 11, "Name": this.translate.instant("CCancelledNew") }
        ];
    }

    Container_Shipment_Operations() {
        return [
            { "Value": 1, "Name": this.translate.instant("ViewCont") },
            { "Value": 2, "Name": this.translate.instant("AssignToShipment") },
            { "Value": 3, "Name": this.translate.instant("RemoveFromShipment") },
            { "Value": 4, "Name": this.translate.instant("ReturnedByCustomer") },
            { "Value": 5, "Name": this.translate.instant("SetDamaged") },
            { "Value": 6, "Name": this.translate.instant("CloseCont") },
            { "Value": 7, "Name": this.translate.instant("PostToInventory") }
        ];
    }

    Shipment_Lines_Status_DropDown() {
        return [
            { "Value": 1, "Name": this.translate.instant("CStatusNew") },
            { "Value": 2, "Name": this.translate.instant("Part_Allocated") },
            { "Value": 3, "Name": this.translate.instant("Allocated") },
            { "Value": 4, "Name": this.translate.instant("Pick_Generated") },
            { "Value": 5, "Name": this.translate.instant("Pick_Released") },
            { "Value": 6, "Name": this.translate.instant("Part_Picked") },
            { "Value": 7, "Name": this.translate.instant("Picked") },
            { "Value": 8, "Name": this.translate.instant("CShippedNew") },
            { "Value": 9, "Name": this.translate.instant("CCancelledNew") }
        ];
    }

    Container_Operation_Add_Items() {
        return [
            { "Value": 1, "Name": this.translate.instant("Add") },
            { "Value": 2, "Name": this.translate.instant("Remove") },
            { "Value": 3, "Name": this.translate.instant("Query") },
            { "Value": 4, "Name": this.translate.instant("Delete_Item") },
            { "Value": 5, "Name": this.translate.instant("Delete_All_Items") }
        ];
    }

    Container_Operation_Add_Container() {
        return [
            { "Value": 1, "Name": this.translate.instant("Add") },
            { "Value": 2, "Name": this.translate.instant("Remove") },
            { "Value": 3, "Name": this.translate.instant("Delete_All") }
        ];
    }

    ContainerBuildSourceEnum() {
        return [
            { "Value": 1, "Name": this.translate.instant("Manufacturing") },
            { "Value": 2, "Name": this.translate.instant("Received_From_Vendor") },
            { "Value": 3, "Name": this.translate.instant("Packed_In_WareHouse") }
        ];
    }

    PickListEnum() {
        return [
            { "Value": 1, "Name": this.translate.instant("DropdownMenu_Shipment") },
            { "Value": 2, "Name": this.translate.instant("SalesOrder") },
            { "Value": 3, "Name": this.translate.instant("WorkOrder") }
        ];
    }

    PlanShiftEnum() {
        return [
            { "Value": 1, "Name": 1 }
        ];
    }

    validateOnCheck(SelectedDataArray, AvailableQty, OpenQty, SelectedQty) {

        if (SelectedDataArray.length == 0) {
            if (parseFloat(AvailableQty) > parseFloat(OpenQty)) {
                // let diffAvail = parseFloat(AvailableQty) - parseFloat(OpenQty);
                return OpenQty;
            }
            else {
                return AvailableQty;
            }
        }
        else {
            let remQty: any = parseFloat(OpenQty) - parseFloat(SelectedQty);

            if (remQty == 0) {
                return -1;
            }

            AvailableQty = (AvailableQty - parseFloat(remQty)) > 0 ? parseFloat(remQty) : AvailableQty;

            let diff = parseFloat(remQty) - AvailableQty;
            if (diff >= 0) {
                return AvailableQty;
            }
            else {
                return -1;
            }
        }

    }

    validateOnChange(value, AvailableQty, OpenQty, SelectedQty) {

        if (parseFloat(value) > parseFloat(AvailableQty)) {
            //this.toastr.error('', this.translate.instant("AssignedQty_cannot_be_greater"));
            return false;
        }
        // else if((parseFloat(SelectedQty) + parseFloat(value)) > parseFloat(OpenQty)){
        //     return false;
        // }
        else {
            return true;
        }

    }




    /**
     * Pick list screen status field enmum.
     */
    PickListStatusEnum() {
        return [
            { "Value": 1, "Name": this.translate.instant("CStatusNew") },
            { "Value": 2, "Name": this.translate.instant("Status_Release") },
            { "Value": 3, "Name": this.translate.instant("CAssignedNew") },
            { "Value": 4, "Name": this.translate.instant("Selected") },
            { "Value": 5, "Name": this.translate.instant("Status_Part_Picked") },
            { "Value": 6, "Name": this.translate.instant("Status_Picked") },
            { "Value": 7, "Name": this.translate.instant("CClosedNew") }

        ];
    }

    /**
     * Pick operation field enmum.
     */
    PickOperationEnum() {
        return [
            { "Value": 1, "Name": "PickToTote" },
            { "Value": 2, "Name": "PickToContainer" },
            { "Value": 3, "Name": "Loose" }
        ];
    }

    /**
* Pick operation field enmum.
*/
    PickTypeEnum() {
        return [
            { "Value": 1, "Name": "Batch_Picking" },
            { "Value": 2, "Name": "Cluster_Picking" },
            { "Value": 3, "Name": "Container_Picking" },
            { "Value": 4, "Name": "Discreate_Picking" }
            //{ "Value": 5, "Name": "Zone_Picking" }
        ];
    }

    pickEnum(){
        return [
            { "Value": 1, "Name": "Container" },
            { "Value": 2, "Name": "Item" },
            { "Value": 3, "Name": "Batch" },
            { "Value": 4, "Name": "Serial" }
        ];
    }

   /**


    /**
    * Pick operation field enmum.
    */
    // TransferMeansTypeEnum() {
    //     return [
    //         { Value: 1, Name: this.translate.instant("Manual") },
    //         { Value: 2, Name: this.translate.instant("Name_ForkLift") },
    //         { Value: 3, Name: this.translate.instant("Name_Crane") }
    //     ];
    // }

     /**
    * Pick operation field enmum.
    */
   TransferMeansTypeEnum() {
    return [
        { Value: 1, Name: "Manual" },
        { Value: 2, Name: "ForkLift" },
        { Value: 3, Name: "Crane" }
    ];
}

    public getMeansStringByValue(value: String) {
        var meanText:any=''
        switch (value) {
            case "1": {
                meanText = this.TransferMeansTypeEnum()[0].Name;
                break;
            }
            case "2": {
                meanText = this.TransferMeansTypeEnum()[1].Name;
                break;
            }
            case "3": {
                meanText = this.TransferMeansTypeEnum()[2].Name;
                break;
            }
        }
        return meanText;
    }

    public getMeansValueByText(value: String) {
        var meanValue:any=''
        switch (value) {
            case this.TransferMeansTypeEnum()[0].Name: {
                meanValue = this.TransferMeansTypeEnum()[0].Value;
                break;
            }
            case this.TransferMeansTypeEnum()[1].Name: {
                meanValue = this.TransferMeansTypeEnum()[1].Name;
                break;
            }
            case this.TransferMeansTypeEnum()[2].Name: {
                meanValue = this.TransferMeansTypeEnum()[2].Name;
                break;
            }
        }
        return meanValue;
    }     

    getPickListValue(value: any) {
        //this.PickListStatusEnum().indexOf("Name" value)
    }
}