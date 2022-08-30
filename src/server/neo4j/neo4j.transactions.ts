import { Session, QueryResult } from "neo4j-driver";
import { neo4jTypes } from "@serverUtils/neo4j.utils";

export async function writeService<propTypes>(session: Session, query: string, props: propTypes): Promise<QueryResult> {
    const parsedProps = neo4jTypes(props);

    const res: QueryResult = await session.writeTransaction((tx) => {
        return tx.run(query, parsedProps);
    });

    return res;
}

export async function readService<propTypes>(session: Session, query: string, props: propTypes): Promise<QueryResult> {
    const parsedProps = neo4jTypes(props);

    const res = await session.readTransaction((tx) => {
        return tx.run(query, parsedProps);
    });

    return res;
}
