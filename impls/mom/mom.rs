pub use super::data::*;
pub use crate::traits::mom::*;
pub use crate::traits::oracle::OracleTraitRef;
pub use crate::traits::somemath::SomeMath;
pub use crate::traits::tap::*;
pub use crate::traits::token::TokenRef;
pub use crate::traits::tub::*;
pub use crate::traits::vox::VoxTraitRef;

use brush::{contracts::access_control::*, modifiers, traits::AccountId};
pub const MANAGER: RoleType = ink_lang::selector_id!("MANAGER");
impl<T: MomStorage + AccessControlStorage + SomeMath> MomTrait for T {
    #[modifiers(only_role(MANAGER))]
    default fn set_cap(&mut self, wad: u128) -> Result<(), MomError> {
        TubTraitRef::mold(&MomStorage::get(self).tub_address, 1, wad)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_mat(&mut self, ray: u128) -> Result<(), MomError> {
        let axe = TubTraitRef::get_axe(&MomStorage::get(self).tub_address);
        if axe < self._ray() || axe > ray {
            return Err(MomError::InvalidMold);
        }
        TubTraitRef::mold(&MomStorage::get(self).tub_address, 2, ray)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_tax(&mut self, ray: u128) -> Result<(), MomError> {
        if ray < self._ray() || ray >= 1000001100000000000000000000 {
            return Err(MomError::InvalidMold);
        }
        TubTraitRef::mold(&MomStorage::get(self).tub_address, 3, ray)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_fee(&mut self, ray: u128) -> Result<(), MomError> {
        if ray < self._ray() || ray >= 1000001100000000000000000000 {
            return Err(MomError::InvalidMold);
        }
        TubTraitRef::mold(&MomStorage::get(self).tub_address, 4, ray)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_axe(&mut self, ray: u128) -> Result<(), MomError> {
        let mat = TubTraitRef::get_mat(&MomStorage::get(self).tub_address);
        if ray < self._ray() || ray > mat {
            return Err(MomError::InvalidMold);
        }
        TubTraitRef::mold(&MomStorage::get(self).tub_address, 5, ray)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_tub_gap(&mut self, wad: u128) -> Result<(), MomError> {
        TubTraitRef::mold(&MomStorage::get(self).tub_address, 6, wad)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_pip(&mut self, pip_address: AccountId) -> Result<(), MomError> {
        TubTraitRef::set_pip(&MomStorage::get(self).tub_address, pip_address)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_pep(&mut self, pep_address: AccountId) -> Result<(), MomError> {
        TubTraitRef::set_pep(&MomStorage::get(self).tub_address, pep_address)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_vox(&mut self, vox_address: AccountId) -> Result<(), MomError> {
        TubTraitRef::set_vox(&MomStorage::get(self).tub_address, vox_address)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_tap_gap(&mut self, wad: u128) -> Result<(), MomError> {
        if wad < 950000000000000000 || wad > 1050000000000000000 {
            return Err(MomError::InvalidMold);
        }
        TapTraitRef::mold(&MomStorage::get(self).tap_address, wad)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_way(&mut self, ray: u128) -> Result<(), MomError> {
        if ray >= 1000001100000000000000000000 || ray <= 999998800000000000000000000 {
            return Err(MomError::InvalidMold);
        }
        VoxTraitRef::mold(&MomStorage::get(self).vox_address, ray)?;
        Ok(())
    }
    #[modifiers(only_role(MANAGER))]
    default fn set_how(&mut self, ray: u128) -> Result<(), MomError> {
        VoxTraitRef::tune(&MomStorage::get(self).vox_address, ray)?;
        Ok(())
    }
}
