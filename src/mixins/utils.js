import * as faunadb from "faunadb";

// Fauna typically returns objects that look like:
// {
//   ref: ..
//   ts: ...
//   data: {..}
// }
// We will never use a ref or ts key in our data so we'll just flatten it to work more easily.
function flattenDataKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map((e) => flattenDataKeys(e));
  } else if (typeof obj === "object") {
    // the case where we have just data pointing to an array.
    if (Object.keys(obj).length === 1 && obj.data && Array.isArray(obj.data)) {
      return flattenDataKeys(obj.data);
    } else {
      Object.keys(obj).forEach((k) => {
        if (k === "data") {
          const d = obj[k];
          delete obj.data;

          Object.keys(d).forEach((dataKey) => {
            obj[dataKey] = flattenDataKeys(d[dataKey]);
          });
        } else {
          obj[k] = flattenDataKeys(obj[k]);
        }
      });
    }
    return obj;
  } else {
    return obj;
  }
}

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
}

async function database(record, cmd, ref) {
  // 1er param : data à sauvegarder dans la base
  // 2ème paream : commande (view, insert ou update)
  // 3ème param : référence du record (ne sert que si p2 = update)

  // Connexion à la base distante
  const q = faunadb.query;

  const {
    Call,
    Create,
    Collection,
    CurrentIdentity,
    Paginate,
    Documents,
    Lambda,
    Get,
    Var,
    Select,
    Let,
    Match,
    Index,
    Join,
    If,
    Exists,
    Update,
    Do,
    Add,
    Subtract,
    Not,
    Contains,
    Abort,
    Now,
  } = q;

  const client = new faunadb.Client({
    secret: "fnAFCX5zUkAAzCptqTV0WeGCY9wvyvqrw5ChHcxH",
    domain: "db.eu.fauna.com",
    port: 443,
    scheme: "https",
  });

  switch (cmd) {
    case "view":
      if (record) {
        try {
          const result = flattenDataKeys(
            await client.query(
              q.Map(
                q.Paginate(Documents(Collection("tarifs_livraison"))),
                q.Lambda((x) => q.Get(q.Match(q.Index("nom"), record)))
              )
            )
          );
          return result;
        } catch (error) {
          return "Erreur : " + error;
        }
      } else {
        try {
          const result = flattenDataKeys(
            await client.query(
              q.Map(
                q.Paginate(q.Documents(q.Collection("tarifs_livraison"))),
                q.Lambda((x) => q.Get(x))
              )
            )
          );
          return result;
        } catch (error) {
          return "Erreur : " + error;
        }
      }

    case "insert":
      try {
        const result = flattenDataKeys(await client.query(q.Create(q.Collection("tarifs_livraison"), { data: record })));
        return result;
      } catch (error) {
        return "Erreur : " + error;
      }

    case "update":
      try {
        const result = flattenDataKeys(
          await client.query(
            q.Insert(q.Ref(q.Collection("tarifs_livraison"), ref), 1, "create", {
              data: record,
            })
          )
        );
        return result;
      } catch (error) {
        return "Erreur : " + error;
      }

    default:
      break;
  }
}

export { flattenDataKeys, isFunction, database };
