import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  depName: {
    type: String,
  },
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
