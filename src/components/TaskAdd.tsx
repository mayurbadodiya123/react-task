import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { CoreService } from "../services/CoreService";
import { Link, redirect } from "react-router-dom";

const TaskSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
});

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  // Add other properties as needed
}

export default function TaskAdd() {
  return (
    <div>
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="card col-lg-4 col-md-6 col-sm-12">
            <div className="card-header text-center">
              <h4>Task form</h4>
            </div>
            <div className="card-body">
              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  status: "In Completed",
                }}
                validationSchema={TaskSchema}
                onSubmit={(values) => {
                  const tasks: any = JSON.parse(CoreService.getTask());
                  let maxId = 0;
                  if (tasks.length) {
                    maxId = Math.max(...tasks.map((o: any) => o.id));
                  }

                  const prepareData = [...tasks, { id: maxId + 1, ...values }];
                  CoreService.setTask(JSON.stringify(prepareData));
                  redirect("/list");
                }}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div>
                      <label htmlFor="title">Title:</label>
                      <Field
                        className="form-control"
                        name="title"
                        placeholder="Enter Title"
                      />
                      {errors.title && touched.title ? (
                        <div className="error-message">{errors.title}</div>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="description">Description:</label>
                      <Field
                        className="form-control"
                        name="description"
                        placeholder="Enter Description"
                      />
                      {errors.description && touched.description ? (
                        <div className="error-message">
                          {errors.description}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="status">Status:</label>
                      <Field
                        as="select" // Use Field component for select input
                        className="form-control"
                        name="status"
                      >
                        <option value="In Completed">In Complete</option>
                        <option value="Completed">Completed</option>
                      </Field>
                      {errors.status && touched.status ? (
                        <div className="error-message">{errors.status}</div>
                      ) : null}
                    </div>
                    <div className="text-center mt-2">
                      <button className="btn btn-success" type="submit">
                        Submit
                      </button>

                      <Link to="/list" className="btn btn-danger cancel-button">
                        Cancel
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
