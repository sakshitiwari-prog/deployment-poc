const { addSchoolList } = require("../Controller/school");
const {School} = require("../Schema/School");
jest.mock("../Schema/School");

describe("add school",()=>{
    test("should add a school",async()=>{
        School.create.mockResolvedValue({
            _id:"123",
            name:"test school",
            email:"test@gmail.com"
        })
        const req={
            body:{
                name:"test school",
                email:"test@gmail.com"
            }
        }
        const res={
            json:jest.fn()
        }
        await addSchoolList(req,res)

        expect(School.create).toHaveBeenCalledWith({
            name:"test school",
            email:"test@gmail.com"
        })
        expect(res.json).toHaveBeenCalledWith({
            data:{
                _id:"123",
                name:"test school",
                email:"test@gmail.com"
            }
        })
    })
    test("should handle error",async()=>{
        School.create.mockRejectedValue(new Error("Database error"))
        const req={
            body:{
                name:"test school",
                email:"test@gmail.com"
            }
        }
        const res={
            json:jest.fn()
        }
        await expect(addSchoolList(req,res)).rejects.toThrow('Database error')
    })
})