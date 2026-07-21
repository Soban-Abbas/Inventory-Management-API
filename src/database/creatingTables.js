const {pool}=require("./pool");
exports.createTables=async()=>{
    try {
        const queries=[
            `create table if not exists shops (
            id serial primary key,
            name character varying(20) not null,
            invite_code text not null unique
            )`,



            `create table if not exists employees(
            id serial primary key,
            name character varying(50) not null ,
            phone_number character varying(16) not null unique check (phone_number ~ '^\+[1-9][0-9]{7,14}$'),
            role character varying(15) not null,
            shop_id int not null references shops(id)  on delete cascade on update cascade
            )`,



            `create table if not exists categories (
            id serial primary key,
            name character varying(20) not null ,
            shop_id int not null references shops(id)  on delete cascade on update cascade
            )`,




            `create table if not exists suppliers(
            id serial primary key,
            name character varying(50) not null ,
            address character varying(250) not null,
            phone_number  character varying(16) not null check (phone_number ~ '^\+[1-9][0-9]{7,14}$'),
            shop_id int not null references shops(id) on delete cascade on update cascade
            )`,






            `create table if not exists products (
            id serial primary key,
            name character varying(50) not null,
            price numeric  not null check(price > 0),
            discription text default null,
            category_id int not null references categories(id) on delete set null on update cascade,
            current_stock int not null check(current_stock >=0),
            shop_id int not null references shops(id) on delete cascade on update cascade 
            )`,




            `create table if not exists product_supplier(
            product_id int not null references products(id) on delete cascade on update cascade,
            supplier_id int not null references suppliers(id) on delete cascade,
            price numeric not null check(price>=0)
            )`,



            `create table if not exists track_history(
            id serial primary key,
            employee_id int not null references employees(id) on delete set null on update cascade,
            product_id int not null references products(id) on delete set null on update cascade,
            action character varying(20) not null ,
            quantity int not null check(quantity >=1) ,
            unit_price numeric not null check(unit_price >=0),
            date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            shop_id  int not null references shops(id) on delete cascade
)`,

            `create table if not exists product_image(
            id serial primary key,
            product_id int not null references products(id) on delete cascade on update cascade,
            image_url text default null

            )`
        ]

   await Promise.all(queries.map(async(q)=>await pool.query(q)))
    } catch (error) {
        console.log(error)
    }
}
