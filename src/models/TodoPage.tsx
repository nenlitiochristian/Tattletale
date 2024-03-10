export type TodoCheckedState = {
    checked: 0 | 0.5 | 1
}

export type Todo = {
    content: string;
    checked: TodoCheckedState;
    collapsed: boolean,
    children: TodoNode[];
}

export type PlainText = {
    content: string;
    collapsed: boolean;
    children: TodoNode[];
}

export type TodoNode = PlainText | Todo

export type TodoPage = {
    id: string,
    name: string,
    ownerId: string,
    content: TodoNode[],
}