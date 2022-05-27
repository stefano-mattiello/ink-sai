pub use super::data::*;
pub use crate::traits::mom::*;
pub use crate::traits::oracle::OracleTraitRef;
pub use crate::traits::somemath::SomeMath;
pub use crate::traits::token::TokenRef;
pub use crate::traits::tub::TubTraitRef;
pub use crate::traits::vox::VoxTraitRef;
use ink_prelude::vec::Vec;

use brush::{
    contracts::{access_control::*, pausable::*, traits::psp22::PSP22Ref},
    modifiers,
    traits::Balance,
};
//Top can stop the system with cage function
pub const TOP: RoleType = ink_lang::selector_id!("TOP");
//Mom can set some parameters
pub const MOM: RoleType = ink_lang::selector_id!("MOM");
impl<T: TapStorage + PausableStorage + AccessControlStorage + SomeMath> TapTrait for T {
    // Sai balance, surplus transferred from drip
    default fn joy(&self) -> Balance {
        PSP22Ref::balance_of(&TapStorage::get(self).sai_address, Self::env().account_id())
    }

    // Sin balance, bad debt transferred from bite
    default fn woe(&self) -> Balance {
        PSP22Ref::balance_of(&TapStorage::get(self).sin_address, Self::env().account_id())
    }

    //SKR balance, collateral pending liquidation
    default fn fog(&self) -> Balance {
        PSP22Ref::balance_of(&TapStorage::get(self).skr_address, Self::env().account_id())
    }

    //set gap parameter
    #[modifiers(only_role(MOM))]
    default fn mold(&mut self, val: u128) -> Result<(), TapError> {
        TapStorage::get_mut(self).gap = val;
        Ok(())
    }

    //Sai can be canceled out with Sin via heal
    default fn heal(&self) -> Result<(), TapError> {
        let joy = self.joy(); // Sai balance
        let woe = self.woe(); //Sin balance
        if joy == 0 || woe == 0 {
            return Ok(());
        }
        let wad = self._min(joy, woe);
        TokenRef::burn(
            &TapStorage::get(self).sai_address,
            Self::env().account_id(),
            wad,
        )?;
        TokenRef::burn(
            &TapStorage::get(self).sin_address,
            Self::env().account_id(),
            wad,
        )?;
        Ok(())
    }

    //get the price of SKR in Sai
    default fn s2s(&self) -> u128 {
        let tag = TubTraitRef::tag(&TapStorage::get(self).tub_address);
        let par = VoxTraitRef::get_par(&TapStorage::get(self).vox_address);
        self._rdiv(tag, par)
    }

    //get the amount of skr in sai for boom
    default fn bid(&self, wad: u128) -> u128 {
        let gap = TapStorage::get(self).gap;
        self._rmul(wad, self._wmul(self.s2s(), self._sub(2 * self._wad(), gap)))
    }

    //get the amount of skr in sai for bust
    default fn ask(&self, wad: u128) -> u128 {
        let gap = TapStorage::get(self).gap;
        self._rmul(wad, self._wmul(self.s2s(), gap))
    }

    //collateral sell off called by bust
    default fn flip(&self, wad: u128) -> Result<(), TapError> {
        let amount_of_sai = self.ask(wad);
        if amount_of_sai == 0 {
            return Err(TapError::InvalidFlip);
        }
        PSP22Ref::transfer_builder(
            &TapStorage::get(self).skr_address,
            Self::env().caller(),
            wad,
            Vec::<u8>::new(),
        )
        .call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        PSP22Ref::transfer_from_builder(
            &TapStorage::get(self).sai_address,
            Self::env().caller(),
            Self::env().account_id(),
            amount_of_sai,
            Vec::<u8>::new(),
        )
        .call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        self.heal()?;
        Ok(())
    }

    //inflate and sell called by bust
    default fn flop(&self, wad: u128) -> Result<(), TapError> {
        let fog = self.fog();
        TokenRef::mint(
            &TapStorage::get(self).skr_address,
            Self::env().account_id(),
            self._sub(wad, fog),
        )?;
        self.flip(wad)?;
        if self.joy() != 0 {
            return Err(TapError::InvalidFlop);
        }
        Ok(())
    }
    //function that execute boom
    default fn flap(&self, wad: u128) -> Result<(), TapError> {
        self.heal()?;
        PSP22Ref::transfer_builder(
            &TapStorage::get(self).sai_address,
            Self::env().caller(),
            self.bid(wad),
            Vec::<u8>::new(),
        )
        .call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        TokenRef::burn(
            &TapStorage::get(self).skr_address,
            Self::env().caller(),
            wad,
        )?;
        Ok(())
    }

    //sell SKR in return for Sai (decreases fog, increases joy and woe, can increase SKR supply)
    #[brush::modifiers(when_not_paused)]
    default fn bust(&mut self, wad: u128) -> Result<(), TapError> {
        if wad > self.fog() {
            self.flop(wad)?;
        } else {
            self.flip(wad)?;
        }
        Ok(())
    }
    //sell Sai in return for SKR (decreases joy and woe, decreases SKR supply)
    #[brush::modifiers(when_not_paused)]
    default fn boom(&mut self, wad: u128) -> Result<(), TapError> {
        self.flap(wad)?;
        Ok(())
    }
    // shutting down the system
    #[modifiers(only_role(TOP))]
    #[brush::modifiers(when_not_paused)]
    default fn cage(&mut self, fix: u128) -> Result<(), TapError> {
        self._pause::<PausableError>()?;
        TapStorage::get_mut(self).fix = fix;
        Ok(())
    }
    //exchange sai for gems when the system is caged
    #[brush::modifiers(when_paused)]
    default fn cash(&mut self, wad: u128) -> Result<(), TapError> {
        let gem_address = TubTraitRef::get_gem(&TapStorage::get(self).tub_address);
        TokenRef::burn(
            &TapStorage::get(self).sai_address,
            Self::env().caller(),
            wad,
        )?;
        let fix = TapStorage::get(self).fix;
        PSP22Ref::transfer_builder(
            &gem_address,
            Self::env().caller(),
            self._rmul(wad, fix),
            Vec::<u8>::new(),
        )
        .call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        Ok(())
    }
    #[brush::modifiers(when_paused)]
    default fn mock(&mut self, wad: u128) -> Result<(), TapError> {
        let gem_address = TubTraitRef::get_gem(&TapStorage::get(self).tub_address);
        TokenRef::mint(
            &TapStorage::get(self).sai_address,
            Self::env().caller(),
            wad,
        )?;
        let fix = TapStorage::get(self).fix;
        PSP22Ref::transfer_from_builder(
            &gem_address,
            Self::env().caller(),
            Self::env().account_id(),
            self._rmul(wad, fix),
            Vec::<u8>::new(),
        )
        .call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
        .fire()
        .unwrap()?;
        Ok(())
    }
    //burn skr when the system is caged
    #[brush::modifiers(when_paused)]
    default fn vent(&mut self) -> Result<(), TapError> {
        let fog = self.fog();
        TokenRef::burn(
            &TapStorage::get(self).skr_address,
            Self::env().account_id(),
            fog,
        )?;
        Ok(())
    }
}
