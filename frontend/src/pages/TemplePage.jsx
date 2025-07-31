import "../TemplePage.css"; 
const data = [
  { id: "imagewatthai1", name: "ภาคเหนือ", img: "/images/north.jpg" },
  { id: "imagewatthai2", name: "ภาคกลาง", img: "/images/central.jpg" },
  { id: "imagewatthai3", name: "ภาคตะวันออกเฉียงเหนือ", img: "/images/northeast.jpg" },
  { id: "imagewatthai4", name: "ภาคตะวันตก", img: "/images/west.jpg" },
];

const TemplePage = () => {
  return (
    <div id="temple">
      <h1>TEMPLE BY REGION</h1>
      <p>ค้นหาข้อมูลวัดตามภูมิภาค</p>
      <div className="templeall">
        {data.map((item) => (
          <div className="wat" key={item.id} id={item.id}>
            <img src={item.img} alt={item.name} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplePage;
