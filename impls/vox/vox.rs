pub use super::data::*;
pub use crate::traits::oracle::OracleTraitRef;
use crate::traits::somemath::*;
pub use crate::traits::token::TokenRef;

pub use crate::traits::vox::*;
use brush::{contracts::access_control::*, modifiers, traits::Timestamp};

pub const MOM: RoleType = ink_lang::selector_id!("MOM");
impl<T: VoxStorage + AccessControlStorage + SomeMath> VoxTrait for T {
    default fn era(&self) -> Timestamp {
        Self::env().block_timestamp()
    }
    #[modifiers(only_role(MOM))]
    default fn mold(&mut self, val: u128) -> Result<(), AccessControlError> {
        VoxStorage::get_mut(self).way = val;
        Ok(())
    }
    default fn get_par(&mut self) -> u128 {
        self.prod();
        VoxStorage::get(self).par
    }
    default fn get_way(&mut self) -> u128 {
        self.prod();
        VoxStorage::get(self).way
    }
    #[modifiers(only_role(MOM))]
    default fn tell(&mut self, ray: u128) -> Result<(), AccessControlError> {
        VoxStorage::get_mut(self).fix = ray;
        Ok(())
    }

    #[modifiers(only_role(MOM))]
    default fn tune(&mut self, ray: u128) -> Result<(), AccessControlError> {
        VoxStorage::get_mut(self).how = ray;
        Ok(())
    }

    default fn prod(&mut self) {
        let age = self.era() - VoxStorage::get(self).tau;
        if age == 0 {
            return;
        }
        VoxStorage::get_mut(self).tau = self.era();
        let way = VoxStorage::get(self).way;
        if way != self._ray() {
            let par = VoxStorage::get(self).par;
            let new_par = self._rmul(par, self._rpow(way, age.into()));
            VoxStorage::get_mut(self).par = new_par;
        }
        let how = VoxStorage::get(self).how;
        if how != 0 {
            if VoxStorage::get(self).fix < VoxStorage::get(self).par {
                let add = (how * age as u128) as i128;
                let new_way = self._inj(self._prj(way) + add);
                VoxStorage::get_mut(self).way = new_way;
            } else {
                let add = -((how * age as u128) as i128);
                let new_way = self._inj(self._prj(way) + add);
                VoxStorage::get_mut(self).way = new_way;
            }
        }
    }

    default fn _inj(&self, x: i128) -> u128 {
        if x >= 0 {
            (x as u128) + self._ray()
        } else {
            self._rdiv(self._ray(), self._ray() + (-x) as u128)
        }
    }
    default fn _prj(&self, x: u128) -> i128 {
        if x > self._ray() {
            (x - self._ray()) as i128
        } else {
            (self._ray() as i128) - self._rdiv(self._ray(), x) as i128
        }
    }
}
