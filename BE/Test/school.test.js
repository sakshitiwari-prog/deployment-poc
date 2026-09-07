const { addSchoolList,getPermissionList,addPermissionList } = require("../Controller/school");
const {School} = require("../Schema/School");
const {Permission}=require("../Schema/Permission")
jest.mock("../Schema/School");
jest.mock("../Schema/Permission")
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

// test group for getPermissionList
describe("get permission list",()=>{
    test("should give permission list",async()=>{
        const res={
            json:jest.fn()
        }
        const commonRes=[
            {
                _id:"1",
                name:"users:read",
                __v:0,
            },
            {
                _id:"2",
                name:"users:write",
                __v:0,
            },
        ]
        Permission.find.mockResolvedValue(commonRes)
        const req={}
        await getPermissionList(req,res)
        expect(res.json).toHaveBeenCalledWith({
            data:commonRes
        })
    })
    test("should handle error",async()=>{
        const req={}
        Permission.find.mockRejectedValue(new Error("DB error"))
        const res={
            json:jest.fn()
        }
        await expect(getPermissionList(req,res)).rejects.toThrow('DB error')
    })
})
// test group for addPermissionList
describe("add permission list",()=>{
    test("should add permission list",async()=>{
    
        const commonRes={
            _id:"1",
            name:"users:read",
            __v:0,  
        }
        Permission.create.mockResolvedValue(commonRes)
       const req={
            body:{
                name:"users:read",
            }
        }
        const res={
            json:jest.fn()
        }
        await addPermissionList(req,res)
        expect(Permission.create).toHaveBeenCalledWith({
                name:"users:read"
            })
        expect(res.json).toHaveBeenCalledWith({
            data:commonRes
        })
    })
    test("should handle error",async()=>{
        const req={
            body:{
                name:"users:read",
            }
        }
        Permission.create.mockRejectedValue(new Error("DB error"))
        const res={
            json:jest.fn()
        }
        await expect(addPermissionList(req,res)).rejects.toThrow('DB error')
    })
})