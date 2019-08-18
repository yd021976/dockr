export interface AclTreeColmodel {
    colName:string
    size:string
}

export type AclNodeColumnModel = {
    column_model: AclTreeColmodel[], // The colmun model
    columns_before_node: AclTreeColmodel[], // columns before the node
    columns_after_node: AclTreeColmodel[], // columns after the node
    column_size: string,
    node_padding_left: number, // Node indent : Left padding for node level > # of columns in column model property
}