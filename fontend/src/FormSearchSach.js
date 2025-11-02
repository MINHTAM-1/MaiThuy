import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

class FormSearchSach extends React.Component {
  constructor() {
    super();
    this.state = { sach_data: [] };
    this.tukhoa = React.createRef();
  }
  timsach = (e) => {
    let tk = this.tukhoa.current.value;
    let url = "http://localhost:3000/api/sach";
    if (tk) {
      url += `/${tk}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Dữ liệu backend trả về:", data);
        this.setState({ sach_data: data });
      })
      .catch((error) => console.log("Co loi : \n , error"));
  };
  render() {
    const kq = (
      <div>
        <form className="container d-flex justify-content-left mt-4">
          <div className="input-group" style={{ width: "400px" }}>
            <input
              ref={this.tukhoa}
              className="form-control"
              placeholder="ID SÁCH"
            />
            <button
              onClick={this.timsach}
              type="button"
              className="btn btn-primary"
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </form>
        <div className="container mt-4">
          <h4 className="text-left mb-4">DANH MỤC SÁCH</h4>
          <div className="row">
            {this.state.sach_data.map((sach, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={sach.urlHinh}
                    className="card-img-top"
                    alt={sach.tenSach}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-primary">{sach.tenSach}</h5>
                    <p className="card-text">{sach.moTa}</p>
                    <p className="text-danger fw-bold">
                      Giá:{sach.gia.toLocaleString()}đ
                    </p>
                    <p className="text-muted" style={{ fontSize: "13px" }}>
                      Cập nhật: {new Date(sach.capNhat).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
    return kq;
  }
}
export default FormSearchSach;
