"use client";
import { Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { api } from "../utils";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
export default function Dashboard() {
  const router = useRouter();
  const [onboardType, setOnBoardType] = useState("register");
  const [rolesList, setRoleList] = useState<{ name: string; value: string }[]>(
    [],
  );
  const [showPassword, setShowPassword] = useState(false);
  const [schools, setSchools] = useState<{ name: string; value: string }[]>([]);
  const initialvalue = useMemo(() => {
    return {
      name: "",
      email: "",
      password: "",
      role: rolesList[0]?.value,
      schoolId: schools[0]?.value,
    };
  }, [rolesList, schools]);

  async function getSchoolList() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schoolList: any = await api.get("/schools");

    const modifiedList = schoolList.data.data.map(
      (item: { name: string; _id: string }) => ({
        name: item.name,
        value: item._id,
      }),
    );
    console.log(modifiedList, "modifiedList");
    setSchools(modifiedList);
  }
  async function getRolesList() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roleList: any = await api.get("/roles");

    const modifiedList = roleList.data.data.map(
      (item: { name: string; _id: string }) => ({
        name: item.name,
        value: item._id,
      }),
    );
    console.log(modifiedList, "modifiedList");
    setRoleList(modifiedList);
  }
  const Schema = (type: string) => {
    return Yup.object().shape({
      name:
        type === "login"
          ? Yup.string().min(2, "Too Short!").max(50, "Too Long!").notRequired()
          : Yup.string()
              .min(2, "Too Short!")
              .max(50, "Too Long!")
              .required("Required"),

      email: Yup.string().email("Invalid email").required("Required"),
      role: Yup.string().required("Required"),

      password: Yup.string().required("Required"),
      schoolId: Yup.string().required("Required"),
    });
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getSchoolList();
    getRolesList();
  }, []);
  function onBoardTypeSetter(type: string, resetForm) {
    setOnBoardType(type);
    resetForm();
  }
  return (
    <div className="space-y-2">
      <Formik
        initialValues={initialvalue}
        validationSchema={Schema(onboardType)}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            console.log(values, "values");
            const res = await api.post(
              onboardType === "register" ? "/onBoard" : "/login",
              values,
            );
            console.log(res?.data?.data, "resresres");
            localStorage.setItem("user", JSON.stringify(res?.data?.data));

            onboardType === "register"
              ? setOnBoardType("login")
              : router.push(`/Home`);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          resetForm,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit} className="w-3xl flex flex-col gap-2">
            <div className="flex gap-2 ">
              <button
                className="flex-1 p-2 border"
                onClick={() => {
                  onBoardTypeSetter("register", resetForm);
                }}
              >
                register
              </button>
              <button
                onClick={() => {
                  onBoardTypeSetter("login", resetForm);
                }}
                className="flex-1 p-2 border"
              >
                login
              </button>
            </div>
            {onboardType == "register" && (
              <div className=" flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <label id="name">Name:</label>
                  <input
                    type="name"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border p-1"
                    value={values.name}
                  />
                </div>
                {errors.name && touched.name && errors.name}
              </div>
            )}
            <div className=" flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <label id="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  className="border p-1"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
              </div>
              {errors.email && touched.email && errors.email}
            </div>
            <div className=" flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <label id="password">Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  className="border p-1"
                  onBlur={handleBlur}
                  value={values.password}
                />{" "}
                <span
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                >
                  show
                </span>
              </div>
              {errors.password && touched.password && errors.password}{" "}
            </div>
            <div className=" flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <label id="role">Role:</label>
                <select
                  name="role"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border p-1"
                  value={values.role}
                >
                  {rolesList.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && touched.role && errors.role}
            </div>
            <div className=" flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <label id="schoolId">School:</label>
                <select
                  name="schoolId"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border p-1"
                  value={values.schoolId}
                >
                  {schools.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.schoolId && touched.schoolId && errors.schoolId}
            </div>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}
