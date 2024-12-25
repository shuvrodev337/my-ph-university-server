import { FilterQuery, Query } from 'mongoose';
//{}
class QueryBuilder<T> {
  public modelQuery: Query<T[], T>; // this property is for MONGOOSE QUERY, returs an object or array of objects; T here is as example TStudent/TAcademicSemester
  public query: Record<string, unknown>; // this property is for EXPRESS QUERY, it's an object with unknown type values

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    if (this?.query?.searchTerm) {
      const searchTerm = this?.query?.searchTerm ? this?.query?.searchTerm : '';
      // value of modelQuery of 'this' will get -reasigned
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => {
          return { [field]: { $regex: searchTerm, $options: 'i' } };
        }),
      } as FilterQuery<T>);
    }
    return this; //  we are manipulating and then returning 'this'. fror chaining method.
  }
  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    // excludeFields is needed only here, bcz we are exact matching here.
    excludeFields.forEach((element) => delete queryObj[element]);
    // value of modelQuery of 'this' will get -chained with previous value.
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }
  sort() {
    const sort = (this?.query?.sort as string) || '-createdAt'; //  field : -1 or -field are same
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  paginate() {
    const limit = Number(this?.query?.limit) || 10;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }
}
export default QueryBuilder;
