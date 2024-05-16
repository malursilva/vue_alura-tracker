export enum TipoNotificacao {
    SUCESSO, ATENCAO, FALHA
}

export interface INotificacao {
    id: number,
    titulo: string, 
    texto: string,
    tipo: TipoNotificacao
}