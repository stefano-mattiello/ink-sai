#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

/// This contract will be used to represent the shares of a user
/// and other instance of this contract will be used to represent
/// the amount of borrowed tokens
#[brush::contract]
pub mod voxtest {
    use brush::contracts::access_control::*;

    //use ink_lang::codegen::Env;
    use ink_sai::impls::vox::*;
    use ink_sai::traits::somemath::*;
    use ink_storage::traits::SpreadAllocate;

    /// Define the storage for PSP22 data, Metadata data and Ownable data
    #[ink(storage)]
    #[derive(Default, SpreadAllocate, VoxStorage, AccessControlStorage)]
    pub struct VoxTest {
        #[AccessControlStorageField]
        access: AccessControlData,
        #[VoxStorageField]
        vox: VoxData,
        era: Timestamp,
    }

    impl AccessControl for VoxTest {}
    impl SomeMath for VoxTest {}
    impl VoxTrait for VoxTest {
        //override era function to make tests
        #[ink(message)]
        fn era(&self) -> Timestamp {
            self._era()
        }
    }
    impl VoxTest {
        #[ink(constructor)]
        pub fn new(par: u128) -> Self {
            ink_lang::codegen::initialize_contract(|instance: &mut VoxTest| {
                let caller = instance.env().caller();
                instance._init_with_admin(caller);
                instance.vox.par = par;
                instance.vox.fix = par;
                instance.vox.way = instance._ray();
                instance.vox.tau = instance.era();
                instance.vox.how = 0;
                instance.era = instance.env().block_timestamp();
            })
        }

        fn _era(&self) -> Timestamp {
            if self.era == 0 {
                self.env().block_timestamp()
            } else {
                self.era
            }
        }
        #[ink(message)]
        pub fn warp(&mut self, age: Timestamp) {
            if age == 0 {
                self.era = 0
            } else {
                let era = self.era;
                self.era = era + age;
            }
        }
    }
    #[cfg(test)]
    mod voxtest {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// Imports `ink_lang` so we can use `#[ink::test]`.
        use ink_lang as ink;
        use primitive_types::U256;
        pub const RAY: u128 = 1000000000000000000000000000;
        pub const WAD: u128 = 1000000000000000000;

        fn wad(ray: u128) -> u128 {
            let result = U256::from(ray)
                .checked_mul(U256::from(WAD))
                .unwrap()
                .checked_add(U256::from(RAY) / 2)
                .unwrap()
                / U256::from(RAY);
            result.as_u128()
        }
        fn ray(wad: u128) -> u128 {
            wad * 1000000000
        }
        fn instance_with_role() -> VoxTest {
            let mut voxtest = VoxTest::new(RAY);
            let alice = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>().alice;
            voxtest
                .grant_role(MOM, alice)
                .expect("Should grant the role");
            voxtest
        }
        fn instance_and_tune() -> Result<VoxTest, AccessControlError> {
            let mut voxtest = VoxTest::new(ray(750000000000000000));
            let alice = ink_env::test::default_accounts::<ink_env::DefaultEnvironment>().alice;
            voxtest
                .grant_role(MOM, alice)
                .expect("Should grant the role");
            voxtest.tune(ray(2000000000000000))?;
            Ok(voxtest)
        }
        /// We test if the default constructor does its job.
        #[ink::test]
        fn new_works() {
            let voxtest = VoxTest::new(RAY);
            assert_eq!(voxtest.era(), 0);
        }
        /// We test a simple use case of our contract.
        #[ink::test]
        fn vox_default_par_works() {
            let mut voxtest = VoxTest::new(RAY);
            assert_eq!(voxtest.get_par(), RAY)
        }
        #[ink::test]
        fn vox_default_way_works() {
            let mut voxtest = VoxTest::new(RAY);
            assert_eq!(voxtest.get_way(), RAY)
        }
        #[ink::test]
        fn vox_coax_works() {
            let mut voxtest = instance_with_role();
            assert_eq!(voxtest.mold(999999406327787478619865402), Ok(()));
            assert_eq!(voxtest.get_way(), 999999406327787478619865402);
        }
        #[ink::test]
        fn vox_prod_works() {
            let mut voxtest = instance_with_role();
            assert_eq!(voxtest.mold(999999406327787478619865402), Ok(()));
            voxtest.prod();
        }

        #[ink::test]
        fn vox_prod_after_warp_1_day_works() {
            let mut voxtest = instance_with_role();
            assert_eq!(voxtest.mold(999999406327787478619865402), Ok(()));
            voxtest.warp(86400);
            voxtest.prod();
        }
        #[ink::test]
        fn vox_par_after_warp_1_day_works() {
            let mut voxtest = instance_with_role();
            assert_eq!(voxtest.mold(999999406327787478619865402), Ok(()));
            voxtest.warp(86400);
            assert_eq!(wad(voxtest.get_par()), 950000000000000000)
        }
        #[ink::test]
        fn vox_par_after_warp_2_day_works() {
            let mut voxtest = instance_with_role();
            assert_eq!(voxtest.mold(999991977495368425989823173), Ok(()));
            voxtest.warp(2 * 86400);
            assert_eq!(wad(voxtest.get_par()), 250000000000000000)
        }
        #[ink::test]
        fn test_price_too_low() {
            let mut voxtest = instance_and_tune().unwrap();
            assert_eq!(voxtest.tell(ray(700000000000000000)), Ok(()));
            voxtest.warp(1);
            assert_eq!(voxtest.get_way(), ray(1002000000000000000));
            voxtest.warp(2);
            assert_eq!(voxtest.get_way(), ray(1006000000000000000));
        }
        #[ink::test]
        fn test_price_too_high() {
            let mut voxtest = instance_and_tune().unwrap();
            assert_eq!(voxtest.tell(ray(800000000000000000)), Ok(()));
            voxtest.warp(1);
            assert_eq!(voxtest.get_way(), 998003992015968063872255489);
            voxtest.warp(2);
            assert_eq!(voxtest.get_way(), 994035785288270377733598410);
        }
    }
}
