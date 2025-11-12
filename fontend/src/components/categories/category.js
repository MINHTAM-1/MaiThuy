import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category_data: []
        };
    }
    // Lấy dữ liệu lần đầu
    componentDidMount() {
        this.get_category('category');
    };
    // Lấy dữ liệu khi ấn nút View All
    onClickViewAll = () => {
        this.get_category('category/viewall');
    };
    // Hàm request API lấy dữ liệu 
    get_category = (view_all) => {
        let url = `http://localhost:5000/api/categories/${view_all}`;
        fetch(url)
            .then(res => {
                if (!res.ok) throw Error(res.statusText);
                return res.json();
            })
            .then(data => {
                console.log("category_data=", data.category);
                this.setState({ category_data: data.category });
            })
            .catch(error => console.log('Có lỗi nè : \n', error))
    }
    // Hiển thị dữ liệu lên GUI
    render() {
        const view_category = <div>
            <div className="container my-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Category</h3>
                    <button onClick={this.onClickViewAll}
                        className="btn btn-outline-primary btn-sm">View All</button>
                </div>
                <div className="row text-center">
                    {this.state.category_data.map((cat, idx) => (
                        <div key={idx} className="col-6 col-md-3 col￾lg-2 mb-4">
                            <div className="p-3 border-0 shadow-none 
h-100">
                                <img
                                    src={cat.icon}
                                    alt={cat.name}
                                    className="img-fluid mb-2"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "contain",
                                    }}
                                />
                                <h6 className="fw-bold">{cat.name}</h6>
                                <p className="text-muted 
small">{cat.items} items</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        return (view_category)
    }
}
export default Category