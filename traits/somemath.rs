use primitive_types::U256;
#[brush::trait_definition]
pub trait SomeMath {
    fn _ray(&self) -> u128 {
        //10_u128.pow(27_u32)
        1000000000000000000000000000
    }
    fn _wad(&self) -> u128 {
        //10_u128.pow(18_u32)
        1000000000000000000
    }
    #[ink(message)]
    fn _rmul(&self, x: u128, y: u128) -> u128 {
        let result = U256::from(x)
            .checked_mul(U256::from(y))
            .unwrap()
            .checked_add(U256::from(self._ray()) / 2)
            .unwrap()
            / U256::from(self._ray());
        result.as_u128()
    }
    #[ink(message)]
    fn _rdiv(&self, x: u128, y: u128) -> u128 {
        let result = U256::from(x)
            .checked_mul(U256::from(self._ray()))
            .unwrap()
            .checked_add(U256::from(y) / 2)
            .unwrap()
            / U256::from(y);
        result.as_u128()
    }
    #[ink(message)]
    fn _wdiv(&self, x: u128, y: u128) -> u128 {
        let result = U256::from(x)
            .checked_mul(U256::from(self._wad()))
            .unwrap()
            .checked_add(U256::from(y) / 2)
            .unwrap()
            / U256::from(y);
        result.as_u128()
    }
    #[ink(message)]
    fn _sub(&self, x: u128, y: u128) -> u128 {
        x.checked_sub(y).unwrap()
    }
    #[ink(message)]
    fn _add(&self, x: u128, y: u128) -> u128 {
        x.checked_add(y).unwrap()
    }
    #[ink(message)]
    fn _wmul(&self, x: u128, y: u128) -> u128 {
        let result = U256::from(x)
            .checked_mul(U256::from(y))
            .unwrap()
            .checked_add(U256::from(self._wad()) / 2)
            .unwrap()
            / U256::from(self._wad());
        result.as_u128()
    }
    fn _min(&self, x: u128, y: u128) -> u128 {
        if x < y {
            x
        } else {
            y
        }
    }
    #[ink(message)]
    fn _rpow(&self, x: u128, n: u128) -> u128 {
        let mut z: u128;
        let mut y = x;
        if n % 2 != 0 {
            z = y
        } else {
            z = 1000000000000000000000000000;
        }
        let mut i = n / 2;
        while i != 0 {
            let new_y = self._rmul(y, y);
            y = new_y;
            if i % 2 != 0 {
                z = self._rmul(z, y);
            }
            i /= 2;
        }
        z
    }
}
