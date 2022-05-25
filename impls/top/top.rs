pub use super::data::*;
pub use crate::traits::oracle::OracleTraitRef;
pub use crate::traits::somemath::SomeMath;
pub use crate::traits::tap::*;
pub use crate::traits::tap::*;
pub use crate::traits::token::TokenRef;
pub use crate::traits::top::*;
pub use crate::traits::tub::*;
pub use crate::traits::vox::VoxTraitRef;

use brush::{
    contracts::{access_control::*, traits::psp22::*},
    modifiers,
    traits::Timestamp,
};
pub const MANAGER: RoleType = ink_lang::selector_id!("MANAGER");
impl<T: TopStorage + AccessControlStorage + SomeMath> TopTrait for T {
    default fn era(&self) -> Timestamp {
        Self::env().block_timestamp()
    }
    
    default fn fix(&self) -> u128{
    TopStorage::get(self).fix
    }
    
    
    default fn fit(&self) ->u128{
    TopStorage::get(self).fit
    }

    default fn cage_at_price(&mut self, price: u128) -> Result<(), TopError> {
        if TubTraitRef::get_off(&TopStorage::get(self).tub_address) || price == 0 {
            return Err(TopError::InvalidCage);
        }
        TopStorage::get_mut(self).caged = self.era();
        TubTraitRef::drip(&TopStorage::get(self).tub_address)?;
        TapTraitRef::heal(&TopStorage::get(self).tap_address)?;
        let par = VoxTraitRef::get_par(&TopStorage::get(self).vox_address);
        let per = TubTraitRef::per(&TopStorage::get(self).tub_address);
        let new_fit = self._rmul(self._wmul(price, par), per);
        TopStorage::get_mut(self).fit = new_fit;
        let sai_total_supply = PSP22Ref::total_supply(&TopStorage::get(self).sai_address);
        if sai_total_supply == 0 {
            let new_fix = self._rdiv(self._wad(), price);
            TopStorage::get_mut(self).fix = new_fix;
        } else {
            let pie = TubTraitRef::pie(&TopStorage::get(self).tub_address);
            let new_fix = self._min(
                self._rdiv(self._wad(), price),
                self._rdiv(pie, sai_total_supply),
            );
            TopStorage::get_mut(self).fix = new_fix;
        }
        let fix = TopStorage::get(self).fix;
        TubTraitRef::cage(
            &TopStorage::get(self).tub_address,
            new_fit,
            self._rmul(fix, sai_total_supply),
        )?;
        TapTraitRef::cage(&TopStorage::get(self).tap_address, fix)?;
        TapTraitRef::vent(&TopStorage::get(self).tap_address)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    fn cage(&mut self) -> Result<(), TopError> {
        let par = VoxTraitRef::get_par(&TopStorage::get(self).vox_address);
        let pip_address = TubTraitRef::get_pip(&TopStorage::get(self).tub_address);
        let val = OracleTraitRef::read(&pip_address);
        self.cage_at_price(self._rdiv(val, par))?;
        Ok(())
    }

    fn flow(&mut self) -> Result<(), TopError> {
        if !TubTraitRef::get_off(&TopStorage::get(self).tub_address) {
            return Err(TopError::InvalidFlow);
        }
        let empty = TubTraitRef::din(&TopStorage::get(self).tub_address) == 0
            && TapTraitRef::fog(&TopStorage::get(self).tap_address) == 0;
        let ended = self.era() > TopStorage::get(self).caged + TopStorage::get(self).cooldown;
        if !empty && !ended {
            return Err(TopError::InvalidFlow);
        }
        TubTraitRef::flow(&TopStorage::get(self).tub_address)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    fn set_cooldown(&mut self, cooldown: u64) -> Result<(), TopError> {
        TopStorage::get_mut(self).cooldown = cooldown;
        Ok(())
    }
}
