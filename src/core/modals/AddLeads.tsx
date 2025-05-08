import { DatePicker } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CommonSelect from '../common/commonSelect';
import CommonTagsInput from '../common/Taginput';
import { status } from '../common/selectoption/selectoption';
import axios from 'axios';
import Select from 'react-select';

interface IFormInput {
  lead_name: string;
  lead_email: string;
  lead_mobile: number;
  lead_city: string;
  lead_source: string;
  lead_campaign_type: string;
  lead_type: string;
  lead_budget: number;
  lead_remark: string;
}

interface LeadType {
  value: string;
  label: string;
}
const AddLeads = () => {
  const [formData, setFormData] = useState({
    lead_name: "",
    lead_email: "",
    lead_mobile: "",
    lead_city: "",
    lead_source: "local",
    lead_campaign_type: "",
    lead_type: "",
    lead_budget: "",
    lead_remark: "",
  })
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token")
  const leadType = [
    // { value: "Select", label: "Select" },
    { value: "Buy", label: "Buy" },
    { value: "Rent", label: "Rent" },
  ];

  // const source = [
  //   { value: "Select", label: "Select" },
  //   { value: "Phone Calls", label: "Phone Calls" },
  //   { value: "Social Media", label: "Social Media" },
  //   { value: "Refferal Sites", label: "Refferal Sites" },
  //   { value: "Web Analytics", label: "Web Analytics" },
  //   { value: "Previous Purchase", label: "Previous Purchase" },
  // ];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
  const handleSelectChange = (selected: LeadType | null, field: keyof IFormInput) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: selected ? selected.value : '',
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("button clicked")

    try {
      const apiUrl = process.env.REACT_APP_URL;

      const response = await axios.post(`${apiUrl}/api/lead/`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response)

    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch Leads.");
    }
  }
  return (
      <>
        <div className="modal fade" id="add_leads">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add New Lead</h4>
                <button
                  type="button"
                  className="btn-close custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body pb-0">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Lead Name <span className="text-danger"> *</span>
                        </label>
                        <input type="text" name='lead_name' value={formData.lead_name} onChange={handleChange} className="form-control" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Email <span className="text-danger"> *</span>
                        </label>
                        <input type="email" name='lead_email' value={formData.lead_email} onChange={handleChange} className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Phone Number <span className="text-danger"> *</span>
                        </label>
                        <input type="number" name='lead_mobile' value={formData.lead_mobile} onChange={handleChange} className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          City  <span className="text-danger"> *</span>
                        </label>
                        <input type="text" name='lead_city' value={formData.lead_city} onChange={handleChange} className="form-control" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Lead Type<span className="text-danger"> *</span>
                        </label>
                        <Select
                          name="leadType"
                          className="select"
                          options={leadType}
                          value={leadType.find(option => option.value === formData.lead_type)}
                          onChange={handleSelectChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Lead Compaign Type <span className="text-danger"> *</span>
                        </label>
                        <input type="text" name='lead_campaign_type' value={formData.lead_campaign_type} onChange={handleChange} className="form-control" required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">
                          Budget <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="number"
                          name='lead_budget'
                          value={formData.lead_budget}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />                      </div>
                    </div>


                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Lead Remark <span className="text-danger"> *</span>
                        </label>
                        <input type="text" name='lead_remark' value={formData.lead_remark} onChange={handleChange} className="form-control" required />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" data-bs-dismiss="modal" className="btn btn-primary">
                    Add Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        :{/* /Add Leads */}
      </>


  )
}

export default AddLeads
