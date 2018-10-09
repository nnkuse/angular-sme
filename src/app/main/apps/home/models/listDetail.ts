export class ListDetail {
    id: string;
    list_of_date_id: string;
    list_detail_name: string;
    in_come: string;
    expense: string;

    constructor(listDetail?) {
        listDetail = listDetail || {};
        this.id = listDetail.id || '';
        this.list_of_date_id = listDetail.list_of_date_id || '';
        this.list_detail_name = listDetail.list_detail_name || '';
        this.in_come = listDetail.in_come || '';
        this.expense = listDetail.expense || '';
    }
}
