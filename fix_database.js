const fs = require("fs");
const p = "E:\\AI Coding\\test-yjl-00003\\api\\database.ts";
let c = fs.readFileSync(p, "utf8");

// Fix: Move created_at before FOREIGN KEY constraints in CREATE TABLE statements
// Pattern: FOREIGN KEY (...) REFERENCES ..., \n        created_at DATETIME
// Replace: created_at DATETIME, \n        FOREIGN KEY (...) REFERENCES ...

// Fix car_models
c = c.replace(
  `FOREIGN KEY (brand_id) REFERENCES car_brands(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES car_brands(id)
      )`
);

// Fix car_series
c = c.replace(
  `FOREIGN KEY (model_id) REFERENCES car_models(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (model_id) REFERENCES car_models(id)
      )`
);

// Fix cars (multiple FKs)
c = c.replace(
  `FOREIGN KEY (brand_id) REFERENCES car_brands(id),
        FOREIGN KEY (model_id) REFERENCES car_models(id),
        FOREIGN KEY (series_id) REFERENCES car_series(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (brand_id) REFERENCES car_brands(id),
        FOREIGN KEY (model_id) REFERENCES car_models(id),
        FOREIGN KEY (series_id) REFERENCES car_series(id)
      )`
);

// Fix locations
c = c.replace(
  `FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
      )`
);

// Fix orders (multiple FKs)
c = c.replace(
  `FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
      )`
);

// Fix order_items (multiple FKs)
c = c.replace(
  `FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (car_id) REFERENCES cars(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (car_id) REFERENCES cars(id)
      )`
);

// Fix order_attachments
c = c.replace(
  `FOREIGN KEY (order_id) REFERENCES orders(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id)
      )`
);

// Fix inventory (multiple FKs)
c = c.replace(
  `FOREIGN KEY (car_id) REFERENCES cars(id),
        FOREIGN KEY (location_id) REFERENCES locations(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (car_id) REFERENCES cars(id),
        FOREIGN KEY (location_id) REFERENCES locations(id)
      )`
);

// Fix settlements (multiple FKs)
c = c.replace(
  `FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
);

// Fix invoices
c = c.replace(
  `FOREIGN KEY (settlement_id) REFERENCES settlements(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (settlement_id) REFERENCES settlements(id)
      )`
);

// Fix commissions (multiple FKs)
c = c.replace(
  `FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
  `created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`
);

fs.writeFileSync(p, c, "utf8");
console.log("Fixed database.ts - moved created_at before FOREIGN KEY");
