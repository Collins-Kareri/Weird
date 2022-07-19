import { Session, QueryResult } from "neo4j-driver";

export async function writeService<propTypes>(session: Session, query: string, props: propTypes): Promise<QueryResult> {
    const res: QueryResult = await session.writeTransaction((tx) => {
        return tx.run(query, props);
    });
    return res;
}

export async function readService<propTypes>(session: Session, query: string, props: propTypes): Promise<QueryResult> {
    const res = await session.readTransaction((tx) => {
        return tx.run(query, props);
    });
    return res;
}
