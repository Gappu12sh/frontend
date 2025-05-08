import React, { useState } from "react";
import { Link } from "react-router-dom";
import CollapseHeader from "../../core/common/collapse-header/collapse-header";
import axios from "axios";
import Select from "react-select";
import * as XLSX from "xlsx";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
interface LeadType {
  value: string;
  label: string;
}

const AddNewLeads = () => {
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
    lead_country: "",
    lead_occupation:"",
    lead_address:""
  });

  const [error, setError] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]); 
  const [isBulkUpload, setIsBulkUpload] = useState(false);

  const token = localStorage.getItem("token");
  // const countries = [
  //   { value: "AF", label: "Afghanistan" },
  //   { value: "AL", label: "Albania" },
  //   { value: "DZ", label: "Algeria" },
  //   { value: "US", label: "United States" },
  //   { value: "IN", label: "India" },
  //   { value: "GB", label: "United Kingdom" },
  //   { value: "CA", label: "Canada" }
  // ]
  const countries = [
    { value: "Afghanistan", label: "Afghanistan" },
    { value: "Albania", label: "Albania" },
    { value: "Algeria", label: "Algeria" },
    { value: "Andorra", label: "Andorra" },
    { value: "Angola", label: "Angola" },
    { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
    { value: "Argentina", label: "Argentina" },
    { value: "Armenia", label: "Armenia" },
    { value: "Australia", label: "Australia" },
    { value: "Austria", label: "Austria" },
    { value: "Azerbaijan", label: "Azerbaijan" },
    { value: "Bahamas", label: "Bahamas" },
    { value: "Bahrain", label: "Bahrain" },
    { value: "Bangladesh", label: "Bangladesh" },
    { value: "Barbados", label: "Barbados" },
    { value: "Belarus", label: "Belarus" },
    { value: "Belgium", label: "Belgium" },
    { value: "Belize", label: "Belize" },
    { value: "Benin", label: "Benin" },
    { value: "Bhutan", label: "Bhutan" },
    { value: "Bolivia", label: "Bolivia" },
    { value: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
    { value: "Botswana", label: "Botswana" },
    { value: "Brazil", label: "Brazil" },
    { value: "Brunei", label: "Brunei" },
    { value: "Bulgaria", label: "Bulgaria" },
    { value: "Burkina Faso", label: "Burkina Faso" },
    { value: "Burundi", label: "Burundi" },
    { value: "Cabo Verde", label: "Cabo Verde" },
    { value: "Cambodia", label: "Cambodia" },
    { value: "Cameroon", label: "Cameroon" },
    { value: "Canada", label: "Canada" },
    { value: "Central African Republic", label: "Central African Republic" },
    { value: "Chad", label: "Chad" },
    { value: "Chile", label: "Chile" },
    { value: "China", label: "China" },
    { value: "Colombia", label: "Colombia" },
    { value: "Comoros", label: "Comoros" },
    { value: "Congo (Congo-Brazzaville)", label: "Congo (Congo-Brazzaville)" },
    { value: "Congo (Congo-Kinshasa)", label: "Congo (Congo-Kinshasa)" },
    { value: "Costa Rica", label: "Costa Rica" },
    { value: "Croatia", label: "Croatia" },
    { value: "Cuba", label: "Cuba" },
    { value: "Cyprus", label: "Cyprus" },
    { value: "Czechia (Czech Republic)", label: "Czechia (Czech Republic)" },
    { value: "Denmark", label: "Denmark" },
    { value: "Djibouti", label: "Djibouti" },
    { value: "Dominica", label: "Dominica" },
    { value: "Dominican Republic", label: "Dominican Republic" },
    { value: "Ecuador", label: "Ecuador" },
    { value: "Egypt", label: "Egypt" },
    { value: "El Salvador", label: "El Salvador" },
    { value: "Equatorial Guinea", label: "Equatorial Guinea" },
    { value: "Eritrea", label: "Eritrea" },
    { value: "Estonia", label: "Estonia" },
    { value: "Eswatini", label: "Eswatini" },
    { value: "Ethiopia", label: "Ethiopia" },
    { value: "Fiji", label: "Fiji" },
    { value: "Finland", label: "Finland" },
    { value: "France", label: "France" },
    { value: "Gabon", label: "Gabon" },
    { value: "Gambia", label: "Gambia" },
    { value: "Georgia", label: "Georgia" },
    { value: "Germany", label: "Germany" },
    { value: "Ghana", label: "Ghana" },
    { value: "Greece", label: "Greece" },
    { value: "Grenada", label: "Grenada" },
    { value: "Guatemala", label: "Guatemala" },
    { value: "Guinea", label: "Guinea" },
    { value: "Guinea-Bissau", label: "Guinea-Bissau" },
    { value: "Guyana", label: "Guyana" },
    { value: "Haiti", label: "Haiti" },
    { value: "Honduras", label: "Honduras" },
    { value: "Hungary", label: "Hungary" },
    { value: "Iceland", label: "Iceland" },
    { value: "India", label: "India" },
    { value: "Indonesia", label: "Indonesia" },
    { value: "Iran", label: "Iran" },
    { value: "Iraq", label: "Iraq" },
    { value: "Ireland", label: "Ireland" },
    { value: "Israel", label: "Israel" },
    { value: "Italy", label: "Italy" },
    { value: "Jamaica", label: "Jamaica" },
    { value: "Japan", label: "Japan" },
    { value: "Jordan", label: "Jordan" },
    { value: "Kazakhstan", label: "Kazakhstan" },
    { value: "Kenya", label: "Kenya" },
    { value: "Kiribati", label: "Kiribati" },
    { value: "Korea, North", label: "Korea, North" },
    { value: "Korea, South", label: "Korea, South" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Kyrgyzstan", label: "Kyrgyzstan" },
    { value: "Laos", label: "Laos" },
    { value: "Latvia", label: "Latvia" },
    { value: "Lebanon", label: "Lebanon" },
    { value: "Lesotho", label: "Lesotho" },
    { value: "Liberia", label: "Liberia" },
    { value: "Libya", label: "Libya" },
    { value: "Liechtenstein", label: "Liechtenstein" },
    { value: "Lithuania", label: "Lithuania" },
    { value: "Luxembourg", label: "Luxembourg" },
    { value: "Madagascar", label: "Madagascar" },
    { value: "Malawi", label: "Malawi" },
    { value: "Malaysia", label: "Malaysia" },
    { value: "Maldives", label: "Maldives" },
    { value: "Mali", label: "Mali" },
    { value: "Malta", label: "Malta" },
    { value: "Marshall Islands", label: "Marshall Islands" },
    { value: "Mauritania", label: "Mauritania" },
    { value: "Mauritius", label: "Mauritius" },
    { value: "Mexico", label: "Mexico" },
    { value: "Micronesia", label: "Micronesia" },
    { value: "Moldova", label: "Moldova" },
    { value: "Monaco", label: "Monaco" },
    { value: "Mongolia", label: "Mongolia" },
    { value: "Montenegro", label: "Montenegro" },
    { value: "Morocco", label: "Morocco" },
    { value: "Mozambique", label: "Mozambique" },
    { value: "Myanmar", label: "Myanmar" },
    { value: "Namibia", label: "Namibia" },
    { value: "Nauru", label: "Nauru" },
    { value: "Nepal", label: "Nepal" },
    { value: "Netherlands", label: "Netherlands" },
    { value: "New Zealand", label: "New Zealand" },
    { value: "Nicaragua", label: "Nicaragua" },
    { value: "Niger", label: "Niger" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "North Macedonia", label: "North Macedonia" },
    { value: "Norway", label: "Norway" },
    { value: "Oman", label: "Oman" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Palau", label: "Palau" },
    { value: "Panama", label: "Panama" },
    { value: "Papua New Guinea", label: "Papua New Guinea" },
    { value: "Paraguay", label: "Paraguay" },
    { value: "Peru", label: "Peru" },
    { value: "Philippines", label: "Philippines" },
    { value: "Poland", label: "Poland" },
    { value: "Portugal", label: "Portugal" },
    { value: "Qatar", label: "Qatar" },
    { value: "Romania", label: "Romania" },
    { value: "Russia", label: "Russia" },
    { value: "Rwanda", label: "Rwanda" },
    { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" },
    { value: "Saint Lucia", label: "Saint Lucia" },
    { value: "Saint Vincent and the Grenadines", label: "Saint Vincent and the Grenadines" },
    { value: "Samoa", label: "Samoa" },
    { value: "San Marino", label: "San Marino" },
    { value: "Sao Tome and Principe", label: "Sao Tome and Principe" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "Senegal", label: "Senegal" },
    { value: "Serbia", label: "Serbia" },
    { value: "Seychelles", label: "Seychelles" },
    { value: "Sierra Leone", label: "Sierra Leone" },
    { value: "Singapore", label: "Singapore" },
    { value: "Slovakia", label: "Slovakia" },
    { value: "Slovenia", label: "Slovenia" },
    { value: "Solomon Islands", label: "Solomon Islands" },
    { value: "Somalia", label: "Somalia" },
    { value: "South Africa", label: "South Africa" },
    { value: "South Sudan", label: "South Sudan" },
    { value: "Spain", label: "Spain" },
    { value: "Sri Lanka", label: "Sri Lanka" },
    { value: "Sudan", label: "Sudan" },
    { value: "Suriname", label: "Suriname" },
    { value: "Sweden", label: "Sweden" },
    { value: "Switzerland", label: "Switzerland" },
    { value: "Syria", label: "Syria" },
    { value: "Taiwan", label: "Taiwan" },
    { value: "Tajikistan", label: "Tajikistan" },
    { value: "Tanzania", label: "Tanzania" },
    { value: "Thailand", label: "Thailand" },
    { value: "Timor-Leste", label: "Timor-Leste" },
    { value: "Togo", label: "Togo" },
    { value: "Tonga", label: "Tonga" },
    { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
    { value: "Tunisia", label: "Tunisia" },
    { value: "Turkey", label: "Turkey" },
    { value: "Turkmenistan", label: "Turkmenistan" },
    { value: "Tuvalu", label: "Tuvalu" },
    { value: "Uganda", label: "Uganda" },
    { value: "Ukraine", label: "Ukraine" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    { value: "Uruguay", label: "Uruguay" },
    { value: "Uzbekistan", label: "Uzbekistan" },
    { value: "Vanuatu", label: "Vanuatu" },
    { value: "Vatican City", label: "Vatican City" },
    { value: "Venezuela", label: "Venezuela" },
    { value: "Vietnam", label: "Vietnam" },
    { value: "Yemen", label: "Yemen" },
    { value: "Zambia", label: "Zambia" },
    { value: "Zimbabwe", label: "Zimbabwe" }
  ];
  
  const leadType = [
    { value: "Buy", label: "Buy" },
    { value: "Rent", label: "Rent" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selected: LeadType | null) => {
    setFormData((prevState) => ({
      ...prevState,
      lead_type: selected ? selected.value : "",
    }));
  };
  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prevState) => ({
      ...prevState,
      lead_mobile: value || "", 
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    console.log(formData)
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_URL;
      const url = isBulkUpload ? `${apiUrl}/api/lead/uploadBulk` : `${apiUrl}/api/lead`;
      console.log(excelData)
      const response = await axios.post(
        url,
        // isBulkUpload ? { leads: excelData } : formData, // Send the bulk leads or single lead
        isBulkUpload ? excelData : formData, // Send the bulk leads or single lead

        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token for authorization
            "Content-Type": "application/json", // Ensure content is in JSON format
          },
        }
      );
      
      if (response.status === 201) {
        alert(isBulkUpload ? "Leads uploaded successfully" : "Lead added successfully");
        
        // Reset form after successful submission
        setFormData({
          lead_name: "",
          lead_email: "",
          lead_mobile: "",
          lead_city: "",
          lead_source: "local",
          lead_campaign_type: "",
          lead_type: "",
          lead_budget: "",
          lead_remark: "",
          lead_country: "",
          lead_occupation:"",
          lead_address:""
        });
        setExcelData([]); // Clear excel data after successful upload
      }
    } catch (error: any) {
      setError(error.response?.message || "Failed to fetch leads");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        if (data) {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          setExcelData(jsonData);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const toggleUploadType = () => {
    setIsBulkUpload(!isBulkUpload);
    setExcelData([]); // Clear excel data when switching back to form
  };

  return (
    <>
      <div className="page-wrapper d-flex flex-column justify-content-between">
        <div className="content flex-fill h-100">
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
              <h2 className="mb-1">Leads</h2>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="ti ti-smart-home" />
                    </Link>
                  </li>
                  <li className="breadcrumb-item">CRM</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leads Grid
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <div className="dropdown">
                  <ul className="dropdown-menu dropdown-menu-end p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        <i className="ti ti-file-type-pdf me-1" />
                        Export as PDF
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        <i className="ti ti-file-type-xls me-1" />
                        Export as Excel{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-2">
                <Link to="/leads-dashboard" className="btn btn-primary d-flex align-items-center">
                  <i className="ti ti-circle-plus me-2" />
                  Lead Dashboard
                </Link>
              </div>
              <div className="head-icons ms-2">
                <CollapseHeader />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body pb-0">
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {isBulkUpload ? "Upload" : "Add Lead"}
                </button>
                <button
                  type="button"
                  className="btn btn-light me-2"
                  onClick={toggleUploadType}
                >
                  {isBulkUpload ? "Add Single Lead" : "Bulk Upload"}
                </button>
              </div>

              {isBulkUpload ? (
                <>
                  <div className="mb-3">
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={handleFileUpload}
                      className="form-control"
                    />
                    <h5>Preview</h5>
                    {excelData.length > 0 && (
                      <div className="mt-3 card overflow-x-auto">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Email</th>
                              <th>Created Date</th>
                              <th>Lead Type</th>
                              <th>Budget</th>
                              <th>Lead City</th>
                              <th>Campaign Type</th>
                              <th>Lead Source</th>
                              <th>Lead Remark</th>
                              <th>Country</th>
                              <th>Occupation</th>
                              <th>Country Code</th>
                              <th>Address</th>
     
                            </tr>
                          </thead>
                          <tbody>
                            {excelData.map((row: any, index: number) => (
                              <tr key={index}>
                                <td>{row["lead_name"]}</td>
                                <td>{row["lead_mobile"]}</td>
                                <td>{row["lead_email"]}</td>
                                <td>{row["lead_date"]}</td>
                                <td>{row["lead_type"]}</td>
                                <td>{row["lead_budget"]}</td>
                                <td>{row["lead_city"]}</td>
                                <td>{row["lead_campaign_type"]}</td>
                                <td>{row["lead_source"]}</td>
                                <td>{row["lead_remark"]}</td>
                                <td>{row["lead_country"]}</td>
                                <td>{row["lead_occupation"]}</td>
                                <td>{row["lead_country_code"]}</td>
                                <td>{row["lead_address"]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">
                          Name <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          name="lead_name"
                          placeholder="John Smith"
                          value={formData.lead_name}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          name="lead_email"
                          placeholder="john@example.com"
                          value={formData.lead_email}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="number"
                          name="lead_mobile"
                          placeholder="9999999999"
                          value={formData.lead_mobile}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div> */}
                       <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Phone Number</label>
                        <PhoneInput
                          international
                          defaultCountry="IN"
                          value={formData.lead_mobile}
                          onChange={handlePhoneChange}
                          className="form-control"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          name="lead_city"
                          placeholder="New York"
                          value={formData.lead_city}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Lead Type</label>
                        <Select
                          name="leadType"
                          className="select"
                          options={leadType}
                          value={leadType.find((option) => option.value === formData.lead_type)}
                          onChange={handleSelectChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Lead Campaign Type</label>
                        <input
                          type="text"
                          name="lead_campaign_type"
                          placeholder="Social Media Campaign"
                          value={formData.lead_campaign_type}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Budget</label>
                        <input
                          type="number"
                          name="lead_budget"
                          placeholder="10,00,000"
                          value={formData.lead_budget}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Country</label>
                        <Select
                          options={countries}
                          value={countries.find(c => c.value === formData.lead_country)}
                          onChange={(selected:any) => setFormData({
                            ...formData,
                            lead_country: selected ? selected.value : "",
                          })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                          name="lead_address"
                          value={formData.lead_address}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Enter address"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Lead Occupation</label>
                        <input
                          type="text"
                          name="lead_occupation"
                          value={formData.lead_occupation}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Lead Remark</label>
                        <input
                          type="text"
                          name="lead_remark"
                          value={formData.lead_remark}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
        <div
          style={{ marginTop: 20 }}
          className="footer d-sm-flex align-items-center justify-content-between border-top bg-white p-3"
        >
          <p className="mb-0">2025 © QuarkLeads.</p>
          <p>
            Designed &amp; Developed By{" "}
            <Link to="#" className="text-primary">
              Shulyn Technologies
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AddNewLeads;