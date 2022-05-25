impl<T: SomeMathStorage> VoxTrait for T {
    default fn _rmul(&self, x: u128, y: u128) -> u128 {
        x.checked_mul(y)
            .unwrap()
            .checked_add(SomeMathStorage::get(self).RAY / 2)
            .unwrap()
            / SomeMathStorage::get(self).RAY
    }
    default fn _rdiv(&self, x: u128, y: u128) -> u128 {
        x.checked_mul(SomeMathStorage::get(self).RAY)
            .unwrap()
            .checked_add(y / 2)
            .unwrap()
            / y
    }
    default fn _wdiv(&self, x: u128, y: u128) -> u128 {
        x.checked_mul(SomeMathStorage::get(self).WAD)
            .unwrap()
            .checked_add(y / 2)
            .unwrap()
            / y
    }
    default fn _sub(&self, x: u128, y: u128) -> u128 {
        x.checked_sub(y).unwrap()
    }
    default fn _add(&self, x: u128, y: u128) -> u128 {
        x.checked_add(y).unwrap()
    }
    default fn _wmul(&self, x: u128, y: u128) -> u128 {
        x.checked_mul(y)
            .unwrap()
            .checked_add(SomeMathStorage::get(self).WAD / 2)
            .unwrap()
            / SomeMathStorage::get(self).WAD
    }
    default fn _min(&self, x: u128, y: u128) -> u128 {
        if x < y {
            x
        } else {
            y
        }
    }
}
